import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

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
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Your Paste</h2>

        <pre className="bg-slate-100 p-4 rounded-md whitespace-pre-wrap">
          {data.content}
        </pre>
      </div>
    </main>
  );
}
