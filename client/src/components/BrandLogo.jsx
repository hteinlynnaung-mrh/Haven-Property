export function BrandLogo({ compact = false, className = '', accentClassName = 'text-moss' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg className="h-10 w-10 shrink-0" viewBox="0 0 48 48" role="img" aria-label="Haven Property logo">
        <defs>
          <linearGradient id="haven-mark" x1="8" y1="7" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d5a45f" />
            <stop offset="1" stopColor="#8fbd8f" />
          </linearGradient>
        </defs>
        <path d="M8 22.5 24 9l16 13.5v15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-15Z" fill="currentColor" opacity=".1" />
        <path d="M6.5 23.5 24 8l17.5 15.5" fill="none" stroke="url(#haven-mark)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <path d="M13 39V25h22v14M19 39V29h10v10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        <circle cx="35.5" cy="13" r="3" fill="#d5a45f" />
      </svg>
      {!compact && <span className="font-serif text-2xl font-semibold tracking-tight">Haven <span className={accentClassName}>Property</span></span>}
    </span>
  );
}
