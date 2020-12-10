// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;


contract Life {

    struct Proof {
        string userId;
        string date;
        string message;
    }

    Proof public lifeProof;

    constructor() public{
        lifeProof = Proof("DVaultInitial","DVaultInitial","DVaultInitial");
    }

    function releaseLifeProof(string memory _fromUser,string memory _date,string memory _message) public{
        lifeProof = Proof(_fromUser, _date,  _message);
    }

    function getLifeProof() public view returns (Proof memory) {
        return lifeProof;
    }
}