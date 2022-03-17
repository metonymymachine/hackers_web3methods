//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { contractABI } from "../Config/abi";
import { dependentcontractABI } from "../Config/dependentcontractABI";
import $ from "jquery";
import WalletConnectProvider from "@walletconnect/web3-provider";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const signature_data_allowlist = require("../../outputData/output_allowlist.json");
const signature_data_cyclops = require("../../outputData/output_cyclops.json");
import Web3Modal from "web3modal";
import AWN from "awesome-notifications";
const { statusChecker } = require("ethereum-status-checker");

const {
  contractAddress,
  dependentcontractAddress,
  alchemy_api,
  INFURA_KEY,
  amount_allowed,
  amount_allowed_cy,
  theContract,
  _price,
  _allowlistPrice,
  _mintpassPrice,
  web3,
  firstAccount,
  globalOptions,
} = require("../Config/script_config");

// Initialize instance of AWN
let notifier = new AWN(globalOptions);
let provider = null;
/** 

* @FUN    init mintpass owners contract 
* @DESC   Gives access to mintpass contract functions

*/
let MPOWNERS_CONTRACT = createAlchemyWeb3(alchemy_api);
let theDependentContract = new MPOWNERS_CONTRACT.eth.Contract(
  dependentcontractABI,
  dependentcontractAddress
);

/** 

* @FUN    loadCurrentSupply
* @DESC   Returns the current supply of a contract

*/

const loadCurrentSupply = async () => {
  const supply = await theContract.methods.getCurrentId().call();

  return supply;
};

/** 

* @FUN    Interval
* @DESC   Returns the current supply of a contract and add to dom

*/

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

/** 

* @FUN    loadPreSaleStatus
* @DESC   Returns the current presale status of a contract

*/

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

/** 

* @FUN    loadSaleStatus
* @DESC   Returns the current sale status of a contract

*/
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

/** 

* @FUN    loadBalanceContract
* @DESC   Returns the current balance of a contract

*/

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

/** 

* @FUN    connectWallet
* @DESC   Connect crypto wallet using web3modal

*/

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
    let web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true,
      providerOptions, // required
    });
    web3Modal.clearCachedProvider();
    provider = await web3Modal.connect();

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
    addressStatus(firstAccount[0]); //Get mintpass user owns
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

/** 

* @FUN    addressStatus
* @DESC   checks the status for the address and adds messages to DOM

*/
const addressStatus = async (acc) => {
  theDependentContract.methods
    .balanceOf(acc)
    .call()
    .then(function (res) {
      MntPss = res.toString();
      console.log(`${acc} MNTPS =>`, MntPss);

      // if a person is on the cyclopslist AND on the allowlist
      // we need to check if the person is ALSO on the Cyclops list
      if (
        signature_data_allowlist[firstAccount[0]] != undefined &&
        signature_data_cyclops[firstAccount[0]] != undefined
      ) {
        //check if users owns a mntpass as well
        if (MntPss > 0) {
          amount_allowed =
            signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
          amount_allowed_cy =
            signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
          //     console.log("User is on allowlist & cyclops list");
          $(".allow_list_text").text(
            `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL. With your Mintpass you can additionally mint up to 10 Cyclops!
        `
          );
          //set allowed in ls
          localStorage.setItem("cyclops_allowed", amount_allowed_cy);
          localStorage.setItem("allowlist_allowed", amount_allowed);
          localStorage.setItem("mintpass_owner_owns", MntPss);
        } else {
          amount_allowed =
            signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
          amount_allowed_cy =
            signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
          console.log("User is on allowlist & cyclops list");
          $(".allow_list_text").text(
            `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL!
        `
          );
          //set allowed in ls
          localStorage.setItem("cyclops_allowed", amount_allowed_cy);
          localStorage.setItem("allowlist_allowed", amount_allowed);
        }
      }
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
      else if (signature_data_cyclops[firstAccount[0]] != undefined) {
        //check if users owns a mntpass as well
        if (MntPss > 0) {
          amount_allowed_cy =
            signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;

          console.log("User is on mntpass & cyclops list");
          $(".allow_list_text").text(
            `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners and you can mint with your mintpass!
          `
          );
          //set allowed in ls
          localStorage.setItem("cyclops_allowed", amount_allowed_cy);
          localStorage.setItem("mintpass_owner_owns", MntPss);
        } else {
          amount_allowed_cy =
            signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
          console.log("User is only on cyclops list no mintpass");
          $(".allow_list_text").text(
            `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners mint!
        `
          );
          //set allowed in ls
          localStorage.setItem("cyclops_allowed", amount_allowed_cy);
        }
      }

      // check if the person owns a mintpass
      else if (MntPss > 0) {
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

/** 

* @FUN    walletReset
* @DESC   Lets user reset the state of wallet

*/

export const walletReset = () => {
  console.log("reseting wallet");
  // web3Modal.clearCachedProvider();
  provider = null;
};

export const walletState = () => {
  if (provider != null) {
    const currentState = web3;

    return currentState;
  } else {
    console.log("Null");
  }
};

/** 

* @FUN    allowlist_mint
* @DESC   Lets user mint if they are in the whitelist

*/

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

/** 

* @FUN    cyclops_mint
* @DESC   Lets user mint who owns a Cyclops by Everynft

*/

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
      $(".allow_list_text").text(allow_list_text);
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

/** 

* @FUN    mintpassMint
* @DESC   Lets user mint who owns a everynft Mintpass

*/

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

/** 

* @FUN    togglePresale
* @DESC   turn on/off presale

*/

export const togglePresale = async () => {
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

/** 

* @FUN    toggleSale
* @DESC   Turn on/off sale

*/
export const toggleSale = async () => {
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

/** 

* @FUN    withdraw
* @DESC   Let owner withdraw eth 

*/
export const withdraw = async () => {
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

/** 

* @FUN    addWalletListener
* @DESC   Detects if user wallet have changed

*/
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

/** 

* @FUN    Conditional
* @DESC   Detects netowrk changes

*/
if (window.ethereum) {
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
