//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { abi } from "./abi";
import $ from "jquery";
import { addresses } from "./whiteListed";
var WAValidator = require("wallet-validator");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import WalletConnectProvider from "@walletconnect/web3-provider";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
import Web3Modal from "web3modal";

var web3;
var web3Modal;
var provider = null;
var firstAccount;

const INFURA_KEY = "5b3b303e5c124bdfb7029389b1a0d599";

export const web3ModalObj = web3Modal;

const contractABI = abi;
const contractAddress = "0x019f5629A978bdcB6e26Dc164f5922508703f63c";
let theContract;

const publicprice = "15000000000000000";
const presaleprice = "00000000000000000";

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
      // metamask: {
      //   id: "injected",
      //   name: "MetaMask",
      //   type: "injected",
      //   check: "isMetaMask",
      // },
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
    $(".metamask-button-text").text(`Connected `);
  } catch (e) {
    console.log("Could not get a wallet connection", e);
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

export const mintPresale = async (amount) => {
  //check if onboard address is empty then connect wallet

  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: firstAccount[0],
    to: contractAddress,
    value: web3.utils.toHex(presaleprice * amount),
    data: theContract.methods.mintPresale(amount).encodeABI(),
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
};

export const mintPublic = async (amount) => {
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: firstAccount[0],
    to: contractAddress,
    value: web3.utils.toHex(publicprice * amount),
    data: theContract.methods.mintPublic(amount).encodeABI(),
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
      console.log(error.message);
      //open wallet to connect automatically if not connected
      connectWallet();
      $(".alert").text(`Please connect a wallet first, To mint a Bobo`);
    }
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
