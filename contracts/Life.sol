// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;


contract Life {

    struct Proof {
        string userId;
        string dateIssued;
        string months;
        string message;
    }

    Proof public lifeProof;

    constructor() public{
        lifeProof = Proof("DVaultInitial","DVaultInitial","DVaultInitial","DVaultInitial");
    }

    function releaseLifeProof(string memory _userId,string memory _dateIssued,string memory _months,string memory _message) public{
        lifeProof = Proof(_userId, _dateIssued, _months,  _message);
    }

    function getLifeProof() public view returns (Proof memory) {
        return lifeProof;
    }
}