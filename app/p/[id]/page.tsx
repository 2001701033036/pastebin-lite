import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getPaste(params.id);

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-slate-900 p-6">
      <div className="bg-white p-6 rounded max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Your Paste</h2>
        <pre className="bg-slate-100 p-4 rounded whitespace-pre-wrap">
          {data.content}
        </pre>
      </div>
    </main>
  );
}
