-- Jalankan seluruh file ini di Supabase SQL Editor.
-- Skema MVP: profil, materi, kuis, dan riwayat pengerjaan.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Siswa',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subject text not null check (subject in ('nahwu', 'sharaf')),
  level text not null default 'Dasar',
  summary text not null,
  content jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  order_no integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  questions jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lessons_subject_order_idx on public.lessons(subject, order_no);
create index if not exists quiz_attempts_user_created_idx on public.quiz_attempts(user_id, created_at desc);
create index if not exists quizzes_lesson_idx on public.quizzes(lesson_id);

-- Buat profil otomatis saat pengguna mendaftar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'Siswa'), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Fungsi pemeriksaan admin untuk policy RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;

-- Profiles: pengguna hanya membaca profil sendiri; admin dapat membaca semua.
drop policy if exists "profile owner or admin can read" on public.profiles;
create policy "profile owner or admin can read"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "admin can manage profiles" on public.profiles;
create policy "admin can manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

-- Lessons: materi terbit dapat dibaca publik; admin mengelola seluruh materi.
drop policy if exists "published lessons are readable" on public.lessons;
create policy "published lessons are readable"
on public.lessons for select
using (published = true or public.is_admin());

drop policy if exists "admin can insert lessons" on public.lessons;
create policy "admin can insert lessons"
on public.lessons for insert
with check (public.is_admin());

drop policy if exists "admin can update lessons" on public.lessons;
create policy "admin can update lessons"
on public.lessons for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin can delete lessons" on public.lessons;
create policy "admin can delete lessons"
on public.lessons for delete
using (public.is_admin());

-- Quizzes: kuis terbit hanya dapat dibaca jika materi induknya terbit.
drop policy if exists "published quizzes are readable" on public.quizzes;
create policy "published quizzes are readable"
on public.quizzes for select
using (
  public.is_admin()
  or (
    published = true
    and exists (
      select 1 from public.lessons
      where lessons.id = quizzes.lesson_id and lessons.published = true
    )
  )
);

drop policy if exists "admin can manage quizzes" on public.quizzes;
create policy "admin can manage quizzes"
on public.quizzes for all
using (public.is_admin())
with check (public.is_admin());

-- Attempts: siswa hanya dapat melihat dan membuat catatan miliknya sendiri.
drop policy if exists "students can read own attempts" on public.quiz_attempts;
create policy "students can read own attempts"
on public.quiz_attempts for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "students can insert own attempts" on public.quiz_attempts;

-- Penilaian dilakukan di database agar siswa tidak dapat mengirim skor buatan dari browser.
create or replace function public.submit_quiz_attempt(p_quiz_id uuid, p_answers jsonb)
returns table(score integer, total integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_questions jsonb;
  v_total integer;
  v_score integer := 0;
  v_index integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception 'Answers must be a JSON array';
  end if;

  select q.questions
  into v_questions
  from public.quizzes q
  join public.lessons l on l.id = q.lesson_id
  where q.id = p_quiz_id
    and q.published = true
    and l.published = true;

  if not found then
    raise exception 'Quiz not found or unpublished';
  end if;

  v_total := jsonb_array_length(v_questions);
  if v_total < 1 or jsonb_array_length(p_answers) <> v_total then
    raise exception 'Answer count does not match quiz';
  end if;

  for v_index in 0..v_total - 1 loop
    if (p_answers ->> v_index)::integer = (v_questions -> v_index ->> 'answer')::integer then
      v_score := v_score + 1;
    end if;
  end loop;

  insert into public.quiz_attempts (quiz_id, user_id, score, total, answers)
  values (p_quiz_id, auth.uid(), v_score, v_total, p_answers);

  return query select v_score, v_total;
end;
$$;

revoke all on function public.submit_quiz_attempt(uuid, jsonb) from public;
grant execute on function public.submit_quiz_attempt(uuid, jsonb) to authenticated;

-- Seed materi dasar. Isi materi perlu dikembangkan dan ditinjau pengajar.
insert into public.lessons (slug, title, subject, level, summary, content, published, order_no)
values
(
  'mengenal-kalimah',
  'Mengenal Kalimah: Isim, Fi''il, dan Huruf',
  'nahwu', 'Dasar',
  'Mengenal tiga kelompok kata utama dalam Bahasa Arab sebagai fondasi mempelajari Nahwu.',
  '[{"heading":"Pengertian Kalimah","body":"Dalam ilmu Nahwu, kalimah adalah lafaz yang memiliki makna. Kalimah dalam Bahasa Arab terbagi menjadi tiga kelompok utama, yaitu isim, fi''il, dan huruf."},{"heading":"Isim","body":"Isim adalah kata yang menunjukkan makna dan tidak terikat dengan waktu. Contohnya كِتَابٌ (buku), طَالِبٌ (siswa), dan مَسْجِدٌ (masjid).","arabic":"كِتَابٌ ، طَالِبٌ ، مَسْجِدٌ"},{"heading":"Fi''il","body":"Fi''il adalah kata yang menunjukkan pekerjaan atau peristiwa dan berkaitan dengan waktu. Contohnya كَتَبَ (telah menulis), يَكْتُبُ (sedang/akan menulis), dan اُكْتُبْ (tulislah).","arabic":"كَتَبَ ، يَكْتُبُ ، اُكْتُبْ"},{"heading":"Huruf","body":"Huruf adalah kata yang maknanya menjadi jelas ketika bergabung dengan kata lain. Contohnya مِنْ (dari), إِلَى (ke), فِي (di dalam), dan عَلَى (di atas).","arabic":"مِنْ ، إِلَى ، فِي ، عَلَى"}]'::jsonb,
  true, 1
),
(
  'jumlah-ismiyah',
  'Jumlah Ismiyah: Mubtada dan Khabar',
  'nahwu', 'Dasar',
  'Memahami kalimat nominal dalam Bahasa Arab dan dua unsur utamanya.',
  '[{"heading":"Pengertian Jumlah Ismiyah","body":"Jumlah ismiyah adalah kalimat yang diawali dengan isim. Unsur pokoknya terdiri atas mubtada dan khabar."},{"heading":"Mubtada","body":"Mubtada adalah isim yang menjadi pokok pembicaraan. Pada pola dasar, mubtada berkedudukan marfu''."},{"heading":"Khabar","body":"Khabar adalah informasi yang menerangkan mubtada. Pada pola dasar, khabar juga berkedudukan marfu''."},{"heading":"Contoh","body":"Pada kalimat زَيْدٌ طَالِبٌ, kata زَيْدٌ merupakan mubtada dan kata طَالِبٌ merupakan khabar. Maknanya: Zaid adalah seorang siswa.","arabic":"زَيْدٌ طَالِبٌ","translation":"Zaid adalah seorang siswa."}]'::jsonb,
  true, 2
),
(
  'wazan-dan-mauzun',
  'Wazan dan Mauzun',
  'sharaf', 'Dasar',
  'Memahami pola kata dan kata yang mengikuti pola tersebut dalam ilmu Sharaf.',
  '[{"heading":"Pengertian Wazan","body":"Wazan adalah pola atau ukuran yang digunakan untuk mengenali susunan huruf asli dan perubahan bentuk suatu kata. Salah satu pola dasar yang sering digunakan adalah فَعَلَ."},{"heading":"Pengertian Mauzun","body":"Mauzun adalah kata yang ditimbang atau dicocokkan dengan wazan. Contohnya كَتَبَ mengikuti pola فَعَلَ."},{"heading":"Contoh penerapan","body":"Kata نَصَرَ, ضَرَبَ, dan فَتَحَ dapat dicocokkan dengan pola فَعَلَ. Pencocokan ini membantu pelajar mengenali pola pembentukan kata.","arabic":"فَعَلَ ← كَتَبَ ، نَصَرَ ، فَتَحَ"}]'::jsonb,
  true, 1
),
(
  'fiil-madhi-mudhari-amr',
  'Fi''il Madhi, Mudhari'', dan Amr',
  'sharaf', 'Dasar',
  'Membedakan bentuk kata kerja berdasarkan waktu dan fungsi perintah.',
  '[{"heading":"Fi''il Madhi","body":"Fi''il madhi menunjukkan pekerjaan yang telah terjadi. Contoh: كَتَبَ yang berarti telah menulis.","arabic":"كَتَبَ"},{"heading":"Fi''il Mudhari''","body":"Fi''il mudhari'' menunjukkan pekerjaan yang sedang atau akan terjadi. Contoh: يَكْتُبُ yang berarti sedang atau akan menulis.","arabic":"يَكْتُبُ"},{"heading":"Fi''il Amr","body":"Fi''il amr menunjukkan perintah untuk melakukan suatu pekerjaan. Contoh: اُكْتُبْ yang berarti tulislah.","arabic":"اُكْتُبْ"},{"heading":"Ringkasan","body":"Ketiga bentuk tersebut memiliki akar makna yang berkaitan, tetapi menunjukkan waktu atau fungsi yang berbeda."}]'::jsonb,
  true, 2
)
on conflict (slug) do nothing;

-- Kuis contoh untuk dua materi awal.
insert into public.quizzes (lesson_id, title, questions, published)
select id, 'Kuis Dasar Kalimah',
'[
  {"question":"Dalam ilmu Nahwu, kalimah terbagi menjadi berapa kelompok utama?","options":["Dua","Tiga","Empat","Lima"],"answer":1,"explanation":"Kalimah terbagi menjadi isim, fi''il, dan huruf."},
  {"question":"Kata كِتَابٌ termasuk kelompok apa?","options":["Isim","Fi''il","Huruf","Jumlah"],"answer":0,"explanation":"كِتَابٌ menunjukkan benda dan tidak terikat waktu, sehingga termasuk isim."},
  {"question":"Kata يَكْتُبُ termasuk jenis apa?","options":["Isim","Fi''il mudhari''","Huruf","Fi''il amr"],"answer":1,"explanation":"يَكْتُبُ menunjukkan pekerjaan yang sedang atau akan dilakukan."}
]'::jsonb, true
from public.lessons where slug = 'mengenal-kalimah'
and not exists (select 1 from public.quizzes where lesson_id = lessons.id and title = 'Kuis Dasar Kalimah');

insert into public.quizzes (lesson_id, title, questions, published)
select id, 'Kuis Dasar Sharaf',
'[
  {"question":"Apa yang dimaksud dengan wazan?","options":["Kata yang ditimbang","Pola atau ukuran kata","Kedudukan kata dalam kalimat","Akhiran i''rab"],"answer":1,"explanation":"Wazan merupakan pola atau ukuran untuk mengenali bentuk kata."},
  {"question":"Kata yang dicocokkan dengan wazan disebut ...","options":["Mauzun","Mubtada","Khabar","Majrur"],"answer":0,"explanation":"Mauzun adalah kata yang ditimbang dengan pola wazan."},
  {"question":"كَتَبَ merupakan contoh bentuk ...","options":["Fi''il mudhari''","Fi''il amr","Fi''il madhi","Isim fa''il"],"answer":2,"explanation":"كَتَبَ berarti telah menulis sehingga termasuk fi''il madhi."}
]'::jsonb, true
from public.lessons where slug = 'wazan-dan-mauzun'
and not exists (select 1 from public.quizzes where lesson_id = lessons.id and title = 'Kuis Dasar Sharaf');

-- Setelah akun admin dibuat melalui halaman Register, jalankan perintah ini
-- dengan mengganti alamat email:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@email.com');
