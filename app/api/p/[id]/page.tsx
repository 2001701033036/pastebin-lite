import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
    <main style={{ padding: "20px" }}>
      <h2>Your Paste</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#f4f4f4",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {data.content}
      </pre>
    </main>
  );
}
