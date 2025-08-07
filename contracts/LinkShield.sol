// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import "hardhat/console.sol";

contract LinkShield {
    struct Link {
        string url;
        address owner;
        uint256 fee;
    }

    uint256 public comission = 1;

    mapping(string => Link) private links;
    mapping(string => mapping(address => bool)) public hasAccess;

    function createLink(
        string calldata url,
        string calldata link_id,
        uint256 fee
    ) public {
        Link memory link = links[link_id];
        require(
            link.owner == address(0) || link.owner == msg.sender,
            "This link has already an owner!"
        );
        require(fee == 0 || fee > comission, "Fee too low!");

        link.url = url;
        link.fee = fee;
        link.owner = msg.sender;

        links[link_id] = link;
        hasAccess[link_id][msg.sender] = true;
    }

    function getLink(
        string calldata link_id
    ) public view returns (Link memory) {
        Link memory link = links[link_id];
        if (link.fee == 0) return link;

        if (hasAccess[link_id][msg.sender] != true) link.url = "";

        return link;
    }

    function buyLink(string calldata link_id) public payable {
        Link memory link = links[link_id];
        require(link.owner != address(0), "Link not found!");
        require(
            hasAccess[link_id][msg.sender] == false,
            "You already have access!"
        );
        require(link.fee >= msg.value, "Insufficient payment!");

        hasAccess[link_id][msg.sender] = true;
        payable(link.owner).transfer(msg.value - comission);
    }
}
