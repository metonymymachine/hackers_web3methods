var Web3 = require("web3");
const fs = require("fs");
// const input_allowlist_clean = require("../inputData/input_allowlist_clean.json");
// const input_claimList_clean = require("../inputData/input_claimList_clean.json");
var rawdata = fs.readFileSync("../../inputData/input_allowlist_clean.json");
var input_allowlist_clean = JSON.parse(rawdata);
var rawdata2 = fs.readFileSync("../../inputData/input_claimList_clean.json");
var input_claimList_clean = JSON.parse(rawdata2);
var rawdatathree = fs.readFileSync(
  "../../inputData/input_mintPassList_clean.json"
);
var input_mintPassList_clean = JSON.parse(rawdatathree);

const keccak256 = require("keccak256");
var web3 = new Web3();
const dotenv = require("dotenv").config();

// file system module to perform file operations

var data = {};
var data_two = {};
var datathree = {};

input_allowlist_clean.forEach(async (e, i) => {
  const messageHash = web3.utils.soliditySha3(e.addr, e.qty_allowed, e.free);

  // Signs the messageHash with a given account
  const signature = await web3.eth.accounts.sign(
    messageHash,
    process.env.PRIVATE_KEY
  );
  //add quantity to signature
  //add data to one big object
  signature["qty_allowed"] = e.qty_allowed;
  signature["free"] = e.free;
  data[Web3.utils.toChecksumAddress(e.addr)] = signature;

  //output json file as a whole at the end
  if (i + 1 == input_allowlist_clean.length) {
    // stringify JSON Object
    var jsonContent = JSON.stringify(data);
    console.log(data);

    fs.writeFile(
      "../../outputData/output_allowlist.json",
      jsonContent,
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }
});

input_claimList_clean.forEach(async (e, i) => {
  console.log(e);
  let messageHash = web3.utils.soliditySha3(e.addr, e.qty_allowed, e.free);

  // Signs the messageHash with a given account
  let signature = await web3.eth.accounts.sign(
    messageHash,
    process.env.PRIVATE_KEY
  );
  //add quantity to signature
  //add data to one big object
  signature["qty_allowed"] = e.qty_allowed;
  signature["free"] = e.free;
  data_two[Web3.utils.toChecksumAddress(e.addr)] = signature;
  console.log(data_two);

  //output json file as a whole at the end
  if (i + 1 == input_claimList_clean.length) {
    console.log(data);
    // stringify JSON Object
    var jsonContent = JSON.stringify(data_two);
    console.log(jsonContent);

    fs.writeFile(
      "../../outputData/output_claimList.json",
      jsonContent,
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }
});

input_mintPassList_clean.forEach(async (e, i) => {
  const messageHash = web3.utils.soliditySha3(e.addr, e.qty_allowed, e.free);

  // Signs the messageHash with a given account
  const signature = await web3.eth.accounts.sign(
    messageHash,
    process.env.PRIVATE_KEY
  );
  //add quantity to signature
  //add data to one big object
  signature["qty_allowed"] = e.qty_allowed;
  signature["free"] = e.free;
  datathree[Web3.utils.toChecksumAddress(e.addr)] = signature;

  //output json file as a whole at the end
  if (i + 1 == input_mintPassList_clean.length) {
    // stringify JSON Object
    var jsonContent = JSON.stringify(datathree);
    console.log(datathree);

    fs.writeFile(
      "../../outputData/output_mintpasslist.json",
      jsonContent,
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }
});
