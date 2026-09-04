import { notFound } from "next/navigation";
import { GAMES } from "@/lib/data";
import { Reproductor } from "@/components/reproductor";

export default async function JugarPage({ params }: PageProps<"/juego/[id]/jugar">) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <Reproductor game={game} />;
}
