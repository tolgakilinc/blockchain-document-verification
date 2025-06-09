// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract DocumentVerifier {
    struct Document {
        string docType;
        address issuer;
        uint256 timestamp;
    }

    mapping(bytes32 => Document) public documents;

    function storeDocumentHash(bytes32 hash, string memory docType) public {
        require(documents[hash].timestamp == 0, "Document already exists.");
        documents[hash] = Document(docType, msg.sender, block.timestamp);
    }

    function verifyDocumentHash(bytes32 hash) public view returns (string memory, address, uint256) {
        Document memory doc = documents[hash];
        require(doc.timestamp != 0, "Document not found.");
        return (doc.docType, doc.issuer, doc.timestamp);
    }
}
