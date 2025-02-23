import { useState } from "react";
import { getThirdwebClient } from "@/utils/thirdweb";
import {
  AccountAddress,
  useEnsName,
  useActiveAccount,
  AccountProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

const Wallet = () => {
  const [copied, setCopied] = useState(false);
  const activeAddress = useActiveAccount()?.address;

  const client = getThirdwebClient();
  const { data: ensName } = useEnsName({
    client,
    address: activeAddress,
  });

  const handleClick = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  if (!activeAddress) {
    return null;
  }

  return (
    <div
      className="border rounded-lg px-4 py-2 flex items-center cursor-pointer hover:bg-muted/50"
      onClick={handleClick}
    >
      {copied ? (
        <div className="text-xs">Copied!</div>
      ) : ensName ? (
        ensName
      ) : (
        <AccountProvider address={activeAddress} client={client}>
          <AccountAddress className="text-xs" formatFn={shortenAddress} />
        </AccountProvider>
      )}
    </div>
  );
};

export default Wallet;
