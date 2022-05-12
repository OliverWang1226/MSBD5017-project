// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract item {
    struct Item {
        address owner;
        uint itemId;
        string itemName;
        string itemDescription;
        string itemCoverHash;
        uint totalRating;
        uint totalCount;
    }

    struct ItemDetail {
        Rating[] ratings;
        mapping(address => bool) ratedUserMap;
    }

    struct Rating {
        address userAddress;
        string reviewContent;
        uint ratingScore;
        uint date;
    }

    uint totalItems;
    uint[] itemIds;
    
    mapping(uint => Item) itemIdMap;
    mapping(address => uint[]) itemUserRatedMap;
    mapping(address => uint[]) itemUserCreatedMap;
    mapping(uint => ItemDetail) itemDetailMap;

    // Stand JoJo
    mapping(address => uint) addressToStand;

    constructor() {
        totalItems = 0;
    }

    /*
        Item Section
    */
    function getTotalItems() public view returns(uint) {
        return totalItems;
    }

    function getAllItemIds() public view returns(uint[] memory) {
        return itemIds;
    }

    function getItemById(uint id) public view returns(Item memory) {
        return itemIdMap[id];
    }

    function getCreatedItemByAddress() public view returns(Item[] memory) {
        uint[] memory ids = itemUserCreatedMap[msg.sender];
        Item[] memory result = new Item[](ids.length);

        for(uint i = 0; i < ids.length; i++) {
            result[i] = itemIdMap[ids[i]];
        }

        return result;
    }

    function getRatedItemByAddress() public view returns(Item[] memory) {
        uint[] memory ids = itemUserRatedMap[msg.sender];
        Item[] memory result = new Item[](ids.length);

        for(uint i = 0; i < ids.length; i++) {
            result[i] = itemIdMap[ids[i]];
        }

        return result;
    }

    function addItem(string memory name, string memory description, string memory imageHash) public {
        uint id = totalItems;
        // uint id = uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        // msg.sender)));
        totalItems++;

        itemIds.push(id);
        itemIdMap[id] = Item(msg.sender, id, name, description, imageHash, 0, 0);
        itemUserCreatedMap[msg.sender].push(id);

        addStandAtribute();
    }

    /*
        Rating Section
    */
    function getTotalRatingScore(uint id) public view returns(uint) {
        return itemIdMap[id].totalRating;
    }

    function getTotalRatingCount(uint id) public view returns(uint) {
        return itemIdMap[id].totalCount;
    }

    function getRatingListById(uint id) public view returns(Rating[] memory) {
        return itemDetailMap[id].ratings;
    }

    function addReview(uint id, uint _rating, string memory _review) public {
        require(_rating > 0 && _rating <= 5, "Rating score shoud between 1 and 5.");
        require(itemDetailMap[id].ratedUserMap[msg.sender] == false, "You already rated this item.");

        itemIdMap[id].totalCount += 1;
        itemIdMap[id].totalRating += _rating;
        itemDetailMap[id].ratedUserMap[msg.sender] = true;
        itemDetailMap[id].ratings.push(Rating(msg.sender, _review, _rating, block.timestamp));

        itemUserRatedMap[msg.sender].push(id);

        addStandAtribute();
    }

    /* 
        Stand Section
    */
    function getStand() public view returns (uint) {
        return addressToStand[msg.sender];
    }

    function getPower(uint stand) public pure returns (uint) {
        return stand & 0xFFFF;
    }

    function getSpeed(uint stand) public pure returns (uint) {
        return (stand >> 16) & 0xFFFF;
    }

    function getRange(uint stand) public pure returns (uint) {
        return (stand >> 32) & 0xFFFF;
    }

    function getPersistence(uint stand) public pure returns (uint) {
        return (stand >> 48) & 0xFFFF;
    }

    function getPrecision(uint stand) public pure returns (uint) {
        return (stand >> 64) & 0xFFFF;
    }

    function getPotential(uint stand) public pure returns (uint) {
        return (stand >> 80) & 0xFFFF;
    }

    function generateRandom() virtual public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    }

    function addStandAtribute() public {
        uint len = 6;
        uint[] memory stats = new uint[](len);
        stats[0] = 0;
        stats[1] = 16;
        stats[2] = 32;
        stats[3] = 48;
        stats[4] = 64;
        stats[5] = 80;
        uint pos = generateRandom() % len;
        uint stand = getStand();
        uint steps = stats[pos];
        uint updateAttribute = (stand >> steps) & 0xFFFF;
        if (updateAttribute != 0xFFFF) {
            updateAttribute++;
        }
        updateAttribute <<= steps;
        uint left = (stand >> (steps + 16)) << (steps + 16);
        uint right = (stand << (256 - steps)) >> (256 - steps);
        addressToStand[msg.sender] = left | updateAttribute | right;
    }
}