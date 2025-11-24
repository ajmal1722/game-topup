import GameForm from "@/components/admin/games/GameForm";

export default function GamePage({ params }: { params: { id: string } }) {
    return <GameForm gameId={params.id} />;
}
