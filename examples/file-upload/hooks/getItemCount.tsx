import React from "react";
import { getItemContract } from "./getItemContract";

export async function getItemCount() {
    const { contract } = getItemContract();

    if (contract) {
        const result = await contract.getTotalItems();
        console.log(result.toNumber());
        return {Number: result.toNumber()};
    }
    return {Number: 0};
};