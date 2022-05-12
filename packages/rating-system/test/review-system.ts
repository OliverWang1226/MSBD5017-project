import "@nomiclabs/hardhat-ethers";

import { ethers } from "hardhat";
import { expect } from "chai";

const { id } = require("ethers/lib/utils");

describe("item contract", function () {
    let item;
    let hardhatItem;
    let itemName = "firstAlbum";
    let imageHash = "0x123456789";
    let itemDescription = "Hello World!"
    let reviewContent = "Review";
    let score = 5;

    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        [addr1, addr2, ...addrs] = await ethers.getSigners();
        item = await ethers.getContractFactory("item");
    
        hardhatItem = await item.deploy();

        await hardhatItem.addItem(itemName, itemDescription, imageHash);
    });

    it("Test addItem", async function () {
        await hardhatItem.addItem(itemName, itemDescription, imageHash);
        const total = await hardhatItem.getTotalItems();
        expect(total).to.equal(2);
    });

    it("Test getAllItemIds", async function () {
        await hardhatItem.addItem(itemName, itemDescription, imageHash);
        const totalItemIds = await hardhatItem.getAllItemIds();
        expect(totalItemIds[1]).to.equal(1);
    });

    it("Test getItemById", async function () {
        const id = await hardhatItem.getTotalItems() - 1;
        const item = await hardhatItem.getItemById(id);
        expect(item.itemName).to.equal(itemName);
        expect(item.itemDescription).to.equal(itemDescription);
        expect(item.itemCoverHash).to.equal(imageHash);
    });

    it("Test getCreatedItemByAddress", async function () {
        const items = await hardhatItem.getCreatedItemByAddress();
        expect(items.length).to.equal(1);
        expect(items[0].itemName).to.equal(itemName);
        expect(items[0].itemDescription).to.equal(itemDescription);
        expect(items[0].itemCoverHash).to.equal(imageHash);
    });

    it("Test addReview", async function () {
        await hardhatItem.addReview(0, score, reviewContent);
        const totalCount = await hardhatItem.getTotalRatingCount(0);
        const totalScore = await hardhatItem.getTotalRatingScore(0);
        expect(totalCount).to.equal(1);
        expect(totalScore).to.equal(5);
    });

    it("Test getRatingListById", async function () {
        await hardhatItem.addReview(0, score, reviewContent);
        const reviews = await hardhatItem.getRatingListById(0);
        expect(reviews.length).to.equal(1);
        expect(reviews[0].reviewContent).to.equal(reviewContent);
        expect(reviews[0].ratingScore).to.equal(5);
    });

    it("Test stand", async function () {
        const stand = await hardhatItem.getStand();
       console.log(stand);
       expect(stand).to.not.equal(0);
    });
});