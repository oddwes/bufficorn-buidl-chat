import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThirdwebProvider, AutoConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { getThirdwebClient, accountAbstraction } from "./utils/thirdweb";

const supportedWallets = [inAppWallet({ smartAccount: accountAbstraction })];
const client = getThirdwebClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThirdwebProvider>
      <AutoConnect client={client} wallets={supportedWallets} />
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
