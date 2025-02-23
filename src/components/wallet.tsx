import { getThirdwebClient } from "@/utils/thirdweb";
import {
  AccountAddress,
  useEnsName,
  useActiveAccount,
  AccountProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

const Wallet = () => {
  const activeAccount = useActiveAccount();
  const client = getThirdwebClient();
  const { data: ensName } = useEnsName({
    client,
    address: activeAccount?.address,
  });

  if (!activeAccount) {
    return null;
  }

  return (
    <div className="border rounded-lg px-4 py-2 flex items-center">
      {ensName || (
        <AccountProvider address={activeAccount?.address} client={client}>
          <AccountAddress className="text-xs" formatFn={shortenAddress} />
        </AccountProvider>
      )}
    </div>
  );
};

export default Wallet;
