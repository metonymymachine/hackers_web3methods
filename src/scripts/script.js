//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { abi } from "./abi";
import { abi_dependentcontract } from "./abi_dependentContract";
import $ from "jquery";
var WAValidator = require("wallet-validator");

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import WalletConnectProvider from "@walletconnect/web3-provider";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const signature_data_allowlist = require("../outputData/output_allowlist.json");
const signature_data_cyclops = require("../outputData/output_cyclops.json");

import Web3Modal, { local } from "web3modal";
import AWN from "awesome-notifications";

// let alchemy_api =
//"wss://eth-rinkeby.alchemyapi.io/v2/t82OF0MzIcUKcNf_AxDSkVDAouxvS6W3"; // RINKEBY
let alchemy_api =
  "wss://eth-mainnet.alchemyapi.io/v2/jteXmFElZcQhvSIuZckM-3c9AA-_CrcC"; // MAINNET

//Vars for cyclops and allowlist quantity
let amount_allowed, amount_allowed_cy;

//For Nodejs
const { statusChecker } = require("ethereum-status-checker");

// Set global options
let globalOptions = {
  position: "bottom-right",
  animationDuration: "400",
};
// Initialize instance of AWN
let notifier = new AWN(globalOptions);

var web3;
var web3Modal;
export var provider = null;
var firstAccount;
//for mntpass amount
var MntPss;

const INFURA_KEY = "5b3b303e5c124bdfb7029389b1a0d599";

export const web3ModalObj = web3Modal;

// LINES TO CHANGE FOR THE SWTITCH BETWEEN MAINNET AND RINKEBY: 20, 21, 51, 56, 160
const contractABI = abi;
const contractAddress = "0xC4627F3B1727B20Aa30489e2DB973AE1E9BF9110"; // MAINNET
// Mainnet: 0xC4627F3B1727B20Aa30489e2DB973AE1E9BF9110 - Rinkeby: 0xa175900b57c9C11DD6730fceA6a8E18Ed1882111
let theContract;
//For mintpass owners
const dependentcontractABI = abi_dependentcontract;
const dependentcontractAddress = "0xcB5E2e44b4d9e7ED003B295dF7a5FDF072e3D858"; // MAINNET
// Mainnet: 0xcB5E2e44b4d9e7ED003B295dF7a5FDF072e3D858 - Rinkeby: 0x6540a57cBb52d4A3d99c103Fb130732495803561

let MPOWNERS_CONTRACT = createAlchemyWeb3(alchemy_api);
let theDependentContract = new MPOWNERS_CONTRACT.eth.Contract(
  dependentcontractABI,
  dependentcontractAddress
);

//Web interacting functions with main contract

const _price = "77000000000000000";
const _allowlistPrice = "77000000000000000"; //for public sale raffle
const _mintpassPrice = "55000000000000000";
const loadCurrentSupply = async () => {
  const supply = await theContract.methods.getCurrentId().call();

  return supply;
};

// Get the supply and attach
// run this function every 5 sec
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
}, 5000);

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
// export const get_root = async () => {
//   if (provider != null) {
//     const root = await theContract.methods.root
//       .call()
//       .call()
//       .then(function (res) {
//         return res.toString();
//       });
//     $(".root").text(`${root}`);
//   }
// };

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
        metamask: {
          id: "injected",
          name: "MetaMask",
          type: "injected",
          check: "isMetaMask",
        },
      },
    };
    web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true,
      providerOptions, // required
    });
    web3Modal.clearCachedProvider();
    provider = await web3Modal.connect();
    // web3 = new Web3(provider);

    //check for chainid

    // if (Number(chainid) != 1) {

    // }

    localStorage.setItem("walletConnected", "1");

    web3 = createAlchemyWeb3(alchemy_api, { writeProvider: provider });
    //chain name detection
    console.log(provider.networkVersion);
    if (Number(provider.networkVersion) != Number(1)) {
      new AWN().modal(
        "<b >You are connected to the wrong network.<br> Please switch to ETH Mainnet</b>"
      );
    }

    theContract = new web3.eth.Contract(contractABI, contractAddress);
    firstAccount = await web3.eth.getAccounts().then((data) => data);
    console.log(firstAccount);
    //Eevry address has to be checksumed on both scripts before creating signature and frontend
    let checkSummed = web3.utils.toChecksumAddress(firstAccount[0]);
    firstAccount[0] = checkSummed;
    //call mntpss for specific addr when wallet connected!
    getMntPassAmount(firstAccount[0]); //Get mintpass user owns
    //notification texts functions
    notifier.success("Wallet connected successfully!");

    $(".metamask-button").text(
      `Connected ${firstAccount[0].slice(firstAccount[0].length - 4)}`
    );
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    notifier.alert("Connected wallet closed by user.");
    return;
  }
};

//Get the mintpass amount a user owns
const getMntPassAmount = async (acc) => {
  theDependentContract.methods
    .balanceOf(acc)
    .call()
    .then(function (res) {
      MntPss = res.toString();
      console.log(`${acc} MNTPS =>`, MntPss);

      // if a person is on the cyclopslist AND on the allowlist
      // we need to check if the person is ALSO on the Cyclops list
      // if (
      //   signature_data_allowlist[firstAccount[0]] != undefined &&
      //   signature_data_cyclops[firstAccount[0]] != undefined
      // ) {
      //   //check if users owns a mntpass as well
      //   if (MntPss > 0) {
      //     amount_allowed =
      //       signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
      //     amount_allowed_cy =
      //       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
      // //     console.log("User is on allowlist & cyclops list");
      //     $(".allow_list_text").text(
      //       `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL. With your Mintpass you can additionally mint up to 10 Cyclops!
      //   `
      //     );
      //     //set allowed in ls
      //     localStorage.setItem("cyclops_allowed", amount_allowed_cy);
      //     localStorage.setItem("allowlist_allowed", amount_allowed);
      //     localStorage.setItem("mintpass_owner_owns", MntPss);
      //   } else {
      //     amount_allowed =
      //       signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
      //     amount_allowed_cy =
      //       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
      //     console.log("User is on allowlist & cyclops list");
      //     $(".allow_list_text").text(
      //       `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL!
      //   `
      //     );
      //     //set allowed in ls
      //     localStorage.setItem("cyclops_allowed", amount_allowed_cy);
      //     localStorage.setItem("allowlist_allowed", amount_allowed);
      //   }
      // }
      //check if a person is only on the allowlist
      //else
      if (signature_data_allowlist[firstAccount[0]] != undefined) {
        //check if users owns a mntpass as well
        if (MntPss > 0) {
          amount_allowed =
            signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;

          console.log("User is on mntpass & allow list");
          $(".allow_list_text").text(
            `You can mint up to ${amount_allowed} Cyclops in the Public Sale Raffle and you can mint 10 with your mintpass!`
          );
          //set allowed in ls
          localStorage.setItem("allowlist_allowed", amount_allowed);
          localStorage.setItem("mintpass_owner_owns", MntPss);
        } else {
          amount_allowed =
            signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
          console.log("User is only on allowlist no mntpass");
          $(".allow_list_text").text(
            `You can mint up to ${amount_allowed} Cyclops in the Public Raffle Mint!
        `
          );
          //set allowed in ls
          localStorage.setItem("allowlist_allowed", amount_allowed);
        }
      }

      // check if the person is ONLY on the Cyclops List
      // else if (signature_data_cyclops[firstAccount[0]] != undefined) {
      //   //check if users owns a mntpass as well
      //   if (MntPss > 0) {
      //     amount_allowed_cy =
      //       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;

      //     console.log("User is on mntpass & cyclops list");
      //     $(".allow_list_text").text(
      //       `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners and you can mint with your mintpass!
      //     `
      //     );
      //     //set allowed in ls
      //     localStorage.setItem("cyclops_allowed", amount_allowed_cy);
      //     localStorage.setItem("mintpass_owner_owns", MntPss);
      //   } else {
      //     amount_allowed_cy =
      //       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
      //     console.log("User is only on cyclops list no mintpass");
      //     $(".allow_list_text").text(
      //       `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners mint!
      //   `
      //     );
      //     //set allowed in ls
      //     localStorage.setItem("cyclops_allowed", amount_allowed_cy);
      //   }
      // }

      // check if the person owns a mintpass
      else if (MntPss > 0) {
        // code to check the mintpass owner balance
        // getDependentContractBal();
        localStorage.setItem("mintpass_owner_owns", MntPss);
        $(".allow_list_text").text(
          `You can mint with your mintpass at a reduced price!`
        );
      } else {
        $(".allow_list_text").text(
          `Your address is not included in the allowlist and you do not own a Mintpass. Join our Discord for the Next Phase of the Public Raffle Sale.`
        );
        console.log("Not in whitelist!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
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
  if (provider != null) {
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
        $(".alert").text("Your mint has been started! You can check the ");
        $(".alert").append(
          `<a href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
        );
        notifier.success(
          `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
        );
      } catch (error) {
        if (error.code == 4001) {
          $(".alert").show();
          console.log(error.message);
          //   $(".alert").text(`The transaction was aborted`);
          notifier.alert("The transaction was aborted!");
        } else {
          $(".alert").show();
          notifier.warning("Please first connect your wallet");
        }
      }
    } else {
      $(".allow_list_text").text(
        `Your address is not included in the allowlist! Join our Discord for the upcoming Public Raffle Sale.`
      );
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

export const cyclops_mint = async (amount) => {
  if (provider != null) {
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
        $(".alert").text("Your mint has been started! You can check the ");
        $(".alert").append(
          `<a href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
        );
        notifier.success(
          `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
        );
      } catch (error) {
        if (error.code == 4001) {
          $(".alert").show();
          console.log(error.message);
          //  $(".alert").text(`The transaction was aborted`);
          notifier.alert("The transaction was aborted!");
        } else {
          $(".alert").show();
          notifier.warning("Please first connect your wallet");
        }
      }
    } else {
      $(".alert").show();
      $(".allow_list_text").text(
        `Your address is not included in the allowlist! Join our Discord for the upcoming Public Raffle Sale.`
      );
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

export const mintpassMint = async (amount) => {
  if (provider != null) {
    //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      from: firstAccount[0],
      to: contractAddress,
      value: web3.utils.toHex(_mintpassPrice * amount),
      data: theContract.methods.mintpassMint(amount).encodeABI(),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      $(".alert").show();
      $(".alert").text("Your mint has been started! You can check the ");
      $(".alert").append(
        `<a href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
      );
      notifier.success(
        `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
      );
    } catch (error) {
      if (error.code == 4001) {
        $(".alert").show();
        console.log(error.message);
        //   $(".alert").text(`The transaction was aborted`);
        notifier.alert("The transaction was aborted!");
      } else {
        $(".alert").show();
        console.log(error.message);
        $(".alert").text("An error occrued!");
      }
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
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
      $(".metamask-button").text(
        `Connected ${firstAccount[0].slice(firstAccount[0].length - 4)}`
      );
      $(".allow_list_text").text(
        "Metamask Wallet has been changed, please refresh the site and re-connect again"
      );
    });
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
      notifier.warning(
        "<b style=`color:#f93267;`>You are connected to the wrong network. Please switch to ETH Mainnet</b>"
      );
      console.log("This is an unknown network.");
    }
  });
}
