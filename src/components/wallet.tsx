import { getThirdwebClient } from "@/utils/thirdweb";
import {
  AccountAddress,
  useEnsName,
  useActiveAccount,
  AccountProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

const Wallet = () => {
  const activeAddress = useActiveAccount()?.address;

  const client = getThirdwebClient();
  const { data: ensName } = useEnsName({
    client,
    address: activeAddress,
  });

  if (!activeAddress) {
    return null;
  }

  return (
    <div
      className="border rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-muted/50"
      onClick={() => {
        navigator.clipboard.writeText(activeAddress);
      }}
    >
      {ensName || (
        <AccountProvider address={activeAddress} client={client}>
          <AccountAddress className="text-xs" formatFn={shortenAddress} />
        </AccountProvider>
      )}
    </div>
  );
};

export default Wallet;
