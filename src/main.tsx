import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThirdwebProvider, AutoConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { polygon } from "thirdweb/chains";

// Configuration
const clientId = "4e8c81182c3709ee441e30d776223354";
const factoryAddress = "0xD771615c873ba5a2149D5312448cE01D677Ee48A";
const accountAbstraction = {
  factoryAddress,
  chain: polygon,
  gasless: true,
};

const supportedWallets = [inAppWallet({ smartAccount: accountAbstraction })];

const client = createThirdwebClient({ clientId });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThirdwebProvider>
      <AutoConnect client={client} wallets={supportedWallets} />
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
