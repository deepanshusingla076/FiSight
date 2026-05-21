type LegalContentProps = {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
};

export function LegalContent({ title, lastUpdated, sections }: LegalContentProps) {
  return (
    <article className="container max-w-3xl py-20 md:py-28">
      <h1 className="font-headline text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-headline text-xl font-semibold">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
