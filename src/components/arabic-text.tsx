export function ArabicText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div dir="rtl" lang="ar" className={`arabic ${className}`}>{children}</div>;
}
