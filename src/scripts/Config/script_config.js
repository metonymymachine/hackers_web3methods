//Vars for using in script no need to temper
let amount_allowed, amount_allowed_cl, theContract, MntPss;
var web3;
var provider = null;
var firstAccount;

//Contract used in script details
let contractAddress = "0x16D437449378257cA46e5231e221e0AE12Da23E5";
//dependent contract used in script
const dependentcontractAddress = "0x73AF8134139E12f23BAFa4505Bc59EbAaA621B93";
//alchemcy api
let alchemy_api =
  "wss://eth-rinkeby.alchemyapi.io/v2/ESx7lVzbks2ViNPdQrNHwmZkdB3wydux";
const INFURA_KEY = "5b3b303e5c124bdfb7029389b1a0d599";

//prices to be used for minting
const _publicMint = "82000000000000000";
const _allowlistPrice = "76000000000000000"; //for public sale raffle
const _mintpassPrice = "64000000000000000";

// UI name for the tokens
const _token = "WHC";
const _tokens = "WHC";

//notifier module global options
let globalOptions = {
  position: "bottom-right",
  animationDuration: "400",
};

module.exports = {
  contractAddress,
  dependentcontractAddress,
  alchemy_api,
  INFURA_KEY,
  amount_allowed,
  amount_allowed_cl,
  theContract,
  _publicMint,
  _allowlistPrice,
  _mintpassPrice,
  web3,
  provider,
  firstAccount,
  MntPss,
  globalOptions,
  _token,
  _tokens,
};
