import { useQuery } from "@tanstack/react-query";
import Chat from "@/components/chat";
import { apiClient } from "@/lib/api";

export default function AgentRoute() {
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });

    // Show loading state while fetching agents
    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    // Show error state if no agent is found
    if (!query.data?.agents?.[0]) {
        return <div>No agents available.</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-screen-lg">
                <Chat agentId={query.data.agents[0].id} />
            </div>
        </div>
    );
}
