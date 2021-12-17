//import the modules
const { MerkleTree } = require("merkletreejs");
const web3 = require("web3");
const keccak256 = require("keccak256");
const { addresses } = require("./src/whiteListed");
// get the Console class
const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");
//create arr of whitelisted addreses
const whitelistAddresses = addresses;

//convert all addrs to keccak256 hash
const leafNodes = whitelistAddresses.map((addr) =>
  //convert to checksum address format and apply keccak256 hash
  keccak256(web3.utils.toChecksumAddress(addr))
);

//create a merkle tree using our converted keccak addres hash providing the algo we used
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
  duplicateOdd: true,
});

//the above proccess is finshed we needed for generating a tree

//onclient side we get user address and converrt into keccak bacause addresses doesnt exists as the normal address
const claimingAddress = leafNodes[1];

//get the proof for the whitelisted address
const hexProof = merkleTree.getHexProof(claimingAddress);

// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("./src/merkle_root.txt"),
});

// saving to merkle_root.txt file
myLogger.log(merkleTree.getHexRoot());
console.log(merkleTree.getHexRoot());
