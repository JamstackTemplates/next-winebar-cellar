import type { ReactNode } from 'react';

/** Editorial heading block for inner pages: eyebrow, Literata serif title and optional introduction. */
export function PageHead({
  eyebrow,
  title,
  children,
  id,
  before,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional small illustration above the eyebrow. */
  before?: ReactNode;
}) {
  return (
    <header className="wrap pt-10 pb-6 sm:pt-14 sm:pb-8">
      {before}
      <p className="eyebrow">{eyebrow}</p>
      <h1
        id={id}
        className="mt-2.5 mb-4 max-w-[22ch] font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.1] tracking-tight text-ink"
      >
        {title}
      </h1>
      {children ? (
        <div className="max-w-(--measure) text-[clamp(1.02rem,1.4vw,1.15rem)] leading-relaxed text-muted">
          {children}
        </div>
      ) : null}
    </header>
  );
}
