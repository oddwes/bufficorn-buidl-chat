import { createThirdwebClient } from "thirdweb";
import { polygon } from "thirdweb/chains";

// Configuration
const clientId = "4e8c81182c3709ee441e30d776223354";
export const factoryAddress = "0xD771615c873ba5a2149D5312448cE01D677Ee48A";
export const accountAbstraction = {
  factoryAddress,
  chain: polygon,
  gasless: true,
};

let client: ReturnType<typeof createThirdwebClient> | null = null;

export function getThirdwebClient() {
  if (!client) {
    client = createThirdwebClient({ clientId });
  }
  return client;
}
