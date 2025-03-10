import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "./routes/chat";
import Login from "./routes/login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="dark antialiased"
        style={{
          colorScheme: "dark",
        }}
      >
        <BrowserRouter>
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 size-full container">
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                  </Routes>
                </div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
