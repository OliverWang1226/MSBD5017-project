
/*
async function hasSigners(): Promise<boolean> {
    //@ts-ignore
    const metamask = window.ethereum;
    const signers = await (metamask.request({method: 'eth_accounts'}) as Promise<string[]>);
    return signers.length > 0;
}

async function requestAccess(): Promise<boolean> {
    //@ts-ignore
    const result = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
    return result && result.length > 0;
}

export function getContract() {

    
    if (!(await hasSigners()) && !(await requestAccess())) {
        console.log("You are in trouble, no players");
    }
    

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        item.abi,
        provider.getSigner()
    );

    return contract;
    /*
    console.log("We have done it, time to call");
    const el = document.createElement("div");

    const button = document.createElement("Button");
    button.innerText = "Get total items";
    button.onclick = async function name() {
        await contract.getTotalItems();
    }

    document.body.appendChild(el);
    document.body.appendChild(button);
    
}

getContract();
*/

import { ethers } from "ethers";
import React from "react";
import item from "../artifacts/contracts/Items.sol/item.json"

async function hasSigners(): Promise<boolean> {
    //@ts-ignore
    const metamask = window.ethereum;
    const signers = await (metamask.request({method: 'eth_accounts'}) as Promise<string[]>);
    return signers.length > 0;
}

async function requestAccess(): Promise<boolean> {
    //@ts-ignore
    const result = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
    return result && result.length > 0;
}

async function waitt() {
    if (!(await hasSigners()) && !(await requestAccess())) {
        console.log("You are in trouble, no players");
    }
}

export function getItemContract() { 
    waitt();
    const download = React.useCallback(
      async () => {
        try {
            //@ts-ignore
            //const provider = new ethers.providers.JsonRpcProvider("https://rpc.debugchain.net");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, item.abi, provider.getSigner());
            const result = contract.getTotalItems();
            console.log(result);
        } catch (err: any) {
          console.log(err);
          window.alert(`"Error downloading file: ${err}"`);
        }
      },
      []
    );
    return { download };
  }
