// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

contract Data {
    struct Released {
        string fromUser;
        string toUser;
        string ipfsHash;
        string message;
    }

    Released public data;

    constructor() public {
        data = Released(
            "DVaultInitial",
            "DVaultInitial",
            "DVaultInitial",
            "DVaultInitial"
        );
    }

    function releaseData(
        string memory _fromUser,
        string memory _toUser,
        string memory _ipfsHash,
        string memory _message
    ) public {
        data = Released(_fromUser, _toUser, _ipfsHash, _message);
    }

    function getData() public view returns (Released memory) {
        return data;
    }
}
