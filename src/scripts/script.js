//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { abi } from "./abi";
import $ from "jquery";
var WAValidator = require("wallet-validator");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import WalletConnectProvider from "@walletconnect/web3-provider";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const signature_data_allowlist = require("../outputData/output_allowlist.json");
const signature_data_cyclops = require("../outputData/output_cyclops.json");
import Web3Modal from "web3modal";
import AWN from "awesome-notifications";
// Set global options
let globalOptions = {
  position: "bottom-right",
  animationDuration: "400",
};
// Initialize instance of AWN
let notifier = new AWN(globalOptions);

var web3;
var web3Modal;
var provider = null;
var firstAccount;

const INFURA_KEY = "5b3b303e5c124bdfb7029389b1a0d599";

export const web3ModalObj = web3Modal;

const contractABI = abi;
const contractAddress = "0xD4EaFA36a2Cc1d0015CF681ee406CF1856C4B8CE";
let theContract;

const _price = "77000000000000000";
const _allowlistPrice = "66000000000000000";
const _mintpassPrice = "55000000000000000";
const loadCurrentSupply = async () => {
  const supply = await theContract.methods.getCurrentId().call();

  return supply;
};

// Get the supply and attach
// run this function every 3 sec
// class required to display would be .supply
setInterval(() => {
  if (provider != null) {
    loadCurrentSupply()
      .then((val) => {
        $(".supply").text(`${6666 - val}/6.666`);
        console.log(val, "Running supply");
      })
      .catch((err) => {
        console.log(err);
        $(".supply").text("Sorry error occured!");
      });
  }
}, 3000);

export const loadPreSaleStatus = async () => {
  if (provider != null) {
    const preSaleActive = await theContract.methods.PresaleIsActive.call()
      .call()
      .then(function (res) {
        return res.toString();
      });
    $(".pre_sale_status").text(`${preSaleActive}`);
  }
};

//sale status
export const loadSaleStatus = async () => {
  if (provider != null) {
    const SaleActive = await theContract.methods.saleIsActive
      .call()
      .call()
      .then(function (res) {
        return res.toString();
      });
    $(".sale_status").text(`${SaleActive}`);
  }
};

//get root
export const get_root = async () => {
  if (provider != null) {
    const root = await theContract.methods.root
      .call()
      .call()
      .then(function (res) {
        return res.toString();
      });
    $(".root").text(`${root}`);
  }
};

const loadBalanceContract = async () => {
  if (provider != null) {
    const balanceContractWei = await web3.eth
      .getBalance(contractAddress)
      .then(function (res) {
        return res.toString();
      });
    const balanceContract = web3.utils.fromWei(balanceContractWei, "ether");
    return balanceContract;
  }
};

export const connectWallet = async () => {
  try {
    let providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // Mikko's test key - don't copy as your mileage may vary
          infuraId: "5b3b303e5c124bdfb7029389b1a0d599",
        },
      },
    };
    web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true,
      providerOptions, // required
    });
    web3Modal.clearCachedProvider();
    provider = await web3Modal.connect();
    // web3 = new Web3(provider);

    web3 = createAlchemyWeb3(
      "wss://eth-rinkeby.alchemyapi.io/v2/jteXmFElZcQhvSIuZckM-3c9AA-_CrcC",
      { writeProvider: provider }
    );
    theContract = new web3.eth.Contract(contractABI, contractAddress);
    firstAccount = await web3.eth.getAccounts().then((data) => data);
    console.log(firstAccount);
    //window.alert(firstAccount);
    $(".metamask-button").text(
      `Connected ${firstAccount[0].slice(firstAccount[0].length - 4)}`
    );
    notifier.success("Wallet connected successfully!");
    //find how many this specific account can mint
    //add text
    if (signature_data_allowlist[firstAccount[0]] != undefined) {
      let amount_allowed =
        signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
      console.log(amount_allowed, "Amount allowed");
      $(".allow_list_text").text(
        `Your wallet is on our allowlist. You can mint ${amount_allowed} Cyclops.`
      );
    } else {
      $(".allow_list_text").text(
        `Your address is not included in the allowlist! Please come back to the public mint on March 15th.`
      );
      console.log("Not in whitelist!");
    }
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    notifier.alert("Connect wallet aborted: Modal closed by user!");
    return;
  }
};

export const walletReset = () => {
  //onboard.walletReset();
  console.log("reseting wallet");
  web3Modal.clearCachedProvider();
  provider = null;
};

export const walletState = () => {
  if (provider != null) {
    const currentState = web3; // onboard.getState();
    console.log(provider);
    console.log(web3Modal);
    console.log(web3);
    //console.log(currentState);
    return currentState;
  } else {
    console.log("Null");
  }
};

export const allowlist_mint = async (amount) => {
  if (signature_data_allowlist[`${firstAccount[0]}`]) {
    //get user specific wallet signature
    let v = signature_data_allowlist[`${firstAccount[0]}`].v;
    let r = signature_data_allowlist[`${firstAccount[0]}`].r;
    let s = signature_data_allowlist[`${firstAccount[0]}`].s;
    let amount_allowed =
      signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
    let free = signature_data_allowlist[`${firstAccount[0]}`].free;
    //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      from: firstAccount[0],
      to: contractAddress,
      value: web3.utils.toHex(_allowlistPrice * amount),
      data: theContract.methods
        .allowlistMint(amount, v, r, s, amount_allowed, free)
        .encodeABI(),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      $(".alert").show();
      $(".alert").text(
        "The transaction has been initiated. See details here: "
      );
      $(".alert").append(
        `<a href='https://etherscan.io/tx/${txHash}' target='_blank'>Etherscan</a>`
      );
    } catch (error) {
      if (error.code == 4001) {
        $(".alert").show();
        console.log(error.message);
        $(".alert").text(`The transaction was aborted`);
      } else {
        $(".alert").show();
        //open wallet to connect automatically if not connected
        connectWallet();
        console.log(error.message);
        $(".alert").text(`Please connect a wallet first, To mint a Bobo`);
      }
    }
  } else {
    $(".alert").text(`You are not being whitelisted!`);
  }
};

export const cyclops_mint = async (amount) => {
  if (signature_data_cyclops[`${firstAccount[0]}`]) {
    //get user specific wallet signature
    let v = signature_data_cyclops[`${firstAccount[0]}`].v;
    let r = signature_data_cyclops[`${firstAccount[0]}`].r;
    let s = signature_data_cyclops[`${firstAccount[0]}`].s;
    let amount_allowed =
      signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
    let free = signature_data_cyclops[`${firstAccount[0]}`].free;
    //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      from: firstAccount[0],
      to: contractAddress,
      value: web3.utils.toHex("0" * amount),
      data: theContract.methods
        .cyclopsMint(amount, v, r, s, amount_allowed, free)
        .encodeABI(),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      $(".alert").show();
      $(".alert").text("The transaction is initiated. You can view it here: ");
      $(".alert").append(
        `<a href='https://etherscan.io/tx/${txHash}' target='_blank'>Etherscan</a>`
      );
    } catch (error) {
      if (error.code == 4001) {
        $(".alert").show();
        console.log(error.message);
        $(".alert").text(`The transaction was aborted`);
      } else {
        $(".alert").show();
        //open wallet to connect automatically if not connected
        connectWallet();
        console.log(error.message);
        $(".alert").text(`Please connect a wallet first, To mint a Bobo`);
      }
    }
  } else {
    $(".alert").text(`You are not being whitelisted!`);
  }
};

export const togglePresale = async () => {
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: window.ethereum.selectedAddress,
    to: contractAddress,
    data: theContract.methods.togglePresale().encodeABI(),
  };
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return {
      success: true,
      status:
        "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const toggleSale = async () => {
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: window.ethereum.selectedAddress,
    to: contractAddress,
    data: theContract.methods.toggleSale().encodeABI(),
  };
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const withdraw = async () => {
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: window.ethereum.selectedAddress,
    to: contractAddress,
    data: theContract.methods.withdraw().encodeABI(),
  };
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

//Account state listener
export const addWalletListener = () => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (addressArray) => {
      if (addressArray.length > 0) {
        //get the user address and display it to metamask-btn class
        let useraddress = `${addressArray[0].substring(
          0,
          2
        )}..${addressArray[0].slice(length - 2)}`;
        $(".alert").hide();
        //add alert to btn
        $(".metamask-button-text").text(`Connected (${useraddress})`);
      } else {
        $(".alert").text("Please connect a wallet");
      }
    });
  } else {
    $(".alert").text("Please connect a wallet");
  }
};

//check netowrk change if occurs
if (window.ethereum) {
  //check which netowrk user is connected to
  // detect Network account change
  window.ethereum.on("networkChanged", function (networkId) {
    console.log("networkChanged", networkId);
    if (Number(networkId) == 1) {
      console.log("This is mainnet");
      $(".net_version_alert").hide();
    }
    if (Number(networkId) != 1) {
      $(".net_version_alert").show();
      $(".net_version_alert").text("Please connect to mainnet");
      console.log("This is an unknown network.");
    }
  });
}
