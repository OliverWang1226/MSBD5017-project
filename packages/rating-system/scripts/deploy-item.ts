import "@nomiclabs/hardhat-ethers";

import { ethers } from "hardhat";

async function deploy() {
    const contractFactory = await ethers.getContractFactory("item");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    return contract;
} 

//@ts-ignore
async function getTotalItems(contract) {
    const totalItems = await contract.getTotalItems();
    console.log("Get total item:", totalItems);
}

deploy().then(getTotalItems);