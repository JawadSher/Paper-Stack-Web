export type PaperDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PaperDetailPage({ params }: PaperDetailPageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Paper Preview</h1>
      <div className="mt-8 rounded-lg border bg-card p-8 text-muted-foreground">
        Preview and metadata for paper {id} will render here.
      </div>
    </section>
  );
}
