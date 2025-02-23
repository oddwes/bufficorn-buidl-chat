import { useQuery } from "@tanstack/react-query";
import Chat from "@/components/chat";
import { apiClient } from "@/lib/api";
import { useActiveWallet } from "thirdweb/react";

export default function AgentRoute() {
  const query = useQuery({
    queryKey: ["agents"],
    queryFn: () => apiClient.getAgents(),
    refetchInterval: 5_000,
  });

  const address = useActiveWallet();

  console.log(address);
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg">
        <Chat agentId={query.data?.agents[0].id} />
      </div>
    </div>
  );
}
