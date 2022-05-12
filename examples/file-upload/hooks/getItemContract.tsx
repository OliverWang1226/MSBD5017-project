import { ethers } from "ethers";
import { useMetaMask } from "metamask-react";
import React from "react";
import item from "../../../packages/rating-system/artifacts/contracts/Items.sol/item.json"

export function getItemContract() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const contract = React.useMemo(() => {
    if (status === "connected") {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, item.abi, signer);
      return contract;
    }
  }, [ethereum, account, status]);

  return{contract: contract};
}