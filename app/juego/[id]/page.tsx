import { notFound } from "next/navigation";
import { GAMES } from "@/lib/data";
import { GameDetalle } from "@/components/game-detalle";

export default async function GameDetailPage({ params }: PageProps<"/juego/[id]">) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <GameDetalle game={game} />;
}
