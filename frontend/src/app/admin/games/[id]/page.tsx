import GameForm from "@/components/admin/games/GameForm";

export default async function GamePage({ params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;
    
    return <GameForm gameId={id} />;
}
