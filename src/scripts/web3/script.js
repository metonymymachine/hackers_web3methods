//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { contractABI } from "../Config/abi";
import { dependentcontractABI } from "../Config/dependentcontractABI";
import $ from "jquery";
import WalletConnectProvider from "@walletconnect/web3-provider";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const signature_data_allowlist = require("../../outputData/output_allowlist.json");
const signature_data_claimList = require("../../outputData/output_claimList.json");
const signature_data_mintpasslist = require("../../outputData/output_mintpasslist.json");
import Web3Modal from "web3modal";
import AWN from "awesome-notifications";
const { statusChecker } = require("ethereum-status-checker");

let {
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
  firstAccount,
  globalOptions,
  _token,
  _tokens,
  MntPss,
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
        $(".supply").text(`${1583 - val}/1583`);
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
      disableInjectedProvider: false,
    });
    web3Modal.clearCachedProvider();
    provider = await web3Modal.connect();

    localStorage.setItem("walletConnected", "1");

    web3 = createAlchemyWeb3(alchemy_api, { writeProvider: provider });
    //chain name detection
    console.log(provider.networkVersion);
    // if (Number(provider.networkVersion) != Number(1)) {
    //   new AWN().modal(
    //     "<b >You are connected to the wrong network.<br> Please switch to ETH Mainnet</b>"
    //   );
    // }

    theContract = new web3.eth.Contract(contractABI, contractAddress);
    firstAccount = await web3.eth.getAccounts().then((data) => data);
    console.log(firstAccount);
    //Eevry address has to be checksumed on both scripts before creating signature and frontend
    let checkSummed = web3.utils.toChecksumAddress(firstAccount[0]);
    firstAccount[0] = checkSummed;
    //check mintpass for specific addr when wallet connected!
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
  // if a person is on the cyclopslist AND on the allowlist
  // we need to check if the person is ALSO on the Cyclops list

  /*
   * =============================================================
   * ================ Check if user is on the allowlist & is on the claimlist & owns the mintpass =================
   * =============================================================
   */
  if (
    signature_data_allowlist[firstAccount[0]] != undefined &&
    signature_data_claimList[firstAccount[0]] != undefined &&
    signature_data_mintpasslist[firstAccount[0]] != undefined
  ) {
    amount_allowed_cl =
      signature_data_claimList[`${firstAccount[0]}`].qty_allowed;
    //     console.log("User is on allowlist & cyclops list");
    $(".allow_list_text").text(
      `You are eligible for ${amount_allowed_cl} Claims and can mint 3 x WHC with your EveryNFT Mintpass.`
    );
    //set allowed in ls
    localStorage.setItem("cyclops_allowed", amount_allowed_cl);
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the Allowlist && claimlist =================
     * =============================================================
     */
    signature_data_allowlist[firstAccount[0]] != undefined &&
    signature_data_claimList[firstAccount[0]] != undefined
  ) {
    amount_allowed_cl =
      signature_data_claimList[`${firstAccount[0]}`].qty_allowed;
    //     console.log("User is on allowlist & cyclops list");
    $(".allow_list_text").text(
      `You are eligible for ${amount_allowed_cl} Claims and are on the general allowlist for additional 3 Mints. `
    );
    //set allowed in ls
    localStorage.setItem("cyclops_allowed", amount_allowed_cl);
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the Allowlist && mintpass list =================
     * =============================================================
     */
    signature_data_allowlist[firstAccount[0]] != undefined &&
    signature_data_mintpasslist[firstAccount[0]] != undefined
  ) {
    $(".allow_list_text").text(
      `You on the general allowlist for additional 3 Mints and 3 x WHC with your EveryNFT Mintpass. `
    );
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the claimlist & mintpass list =================
     * =============================================================
     */
    signature_data_claimList[firstAccount[0]] != undefined &&
    signature_data_mintpasslist[firstAccount[0]] != undefined
  ) {
    amount_allowed_cl =
      signature_data_claimList[`${firstAccount[0]}`].qty_allowed;
    //     console.log("User is on allowlist & cyclops list");
    $(".allow_list_text").text(
      `You are eligible for ${amount_allowed_cl} Claims and are on the Mintpass list for additional 3 Mints. `
    );
    //set allowed in ls
    localStorage.setItem("cyclops_allowed", amount_allowed_cl);
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the Allowlist  =================
     * =============================================================
     */
    signature_data_allowlist[firstAccount[0]] != undefined
  ) {
    $(".allow_list_text").text(
      `You are are on the general allowlist for 3 Mints. `
    );
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the mintpass list  =================
     * =============================================================
     */
    signature_data_mintpasslist[firstAccount[0]] != undefined
  ) {
    $(".allow_list_text").text(
      `You are are on the Mintpass list for 3 Mints. `
    );
  } else if (
    /*
     * =============================================================
     * ================ Check if user is on the claimlist  =================
     * =============================================================
     */
    signature_data_claimList[firstAccount[0]] != undefined
  ) {
    amount_allowed_cl =
      signature_data_claimList[`${firstAccount[0]}`].qty_allowed;
    //     console.log("User is on allowlist & cyclops list");
    $(".allow_list_text").text(
      `You are eligible for ${amount_allowed_cl} Claims. `
    );
    //set allowed in ls
    localStorage.setItem("cyclops_allowed", amount_allowed_cl);
  } else {
    $(".allow_list_text").text(
      `You are not on the allowlist for our pre-sale. The public sale starts on May 13th, 6pm GMT.`
    );
  }
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
        //show the loading animation when user mints and confirms the mint
        $(".loading-tnx-status").show();
        //check the status
        checkTnxStatus(txHash);
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
        `You are not on the allowlist for our pre-sale. The public sale starts on May 13th, 6pm GMT.`
      );
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

/** 

* @FUN    whc_claim
* @DESC   whc claims

*/

export const claim = async (amount) => {
  if (provider != null) {
    if (signature_data_claimList[`${firstAccount[0]}`]) {
      //get user specific wallet signature
      let v = signature_data_claimList[`${firstAccount[0]}`].v;
      let r = signature_data_claimList[`${firstAccount[0]}`].r;
      let s = signature_data_claimList[`${firstAccount[0]}`].s;
      let amount_allowed =
        signature_data_claimList[`${firstAccount[0]}`].qty_allowed;
      let free = signature_data_claimList[`${firstAccount[0]}`].free;
      //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
      const transactionParameters = {
        from: firstAccount[0],
        to: contractAddress,
        value: web3.utils.toHex("0" * amount),
        data: theContract.methods
          .claim(amount, v, r, s, amount_allowed, free)
          .encodeABI(),
      };
      try {
        web3.eth.sendTransaction(transactionParameters, function (err, txHash) {
          if (err) {
            console.log(err);
          } else {
            $(".alert").show();
            $(".alert").text("Your mint has been started! You can check the ");
            $(".alert").append(
              `<a class="tx_link" href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
            );
            //show the loading animation when user mints and confirms the mint
            $(".loading-tnx-status").show();
            //check the status
            checkTnxStatus(txHash);

            notifier.success(
              `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
            );
            console.log(txHash);
          }
        });
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
        `You are not on the allowlist for our pre-sale. The public sale starts on May 13th, 6pm GMT.`
      );
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
    if (signature_data_mintpasslist[`${firstAccount[0]}`]) {
      //get user specific wallet signature
      let v = signature_data_mintpasslist[`${firstAccount[0]}`].v;
      let r = signature_data_mintpasslist[`${firstAccount[0]}`].r;
      let s = signature_data_mintpasslist[`${firstAccount[0]}`].s;
      let amount_allowed =
        signature_data_mintpasslist[`${firstAccount[0]}`].qty_allowed;
      let free = signature_data_mintpasslist[`${firstAccount[0]}`].free;
      //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
      const transactionParameters = {
        from: firstAccount[0],
        to: contractAddress,
        value: web3.utils.toHex(_mintpassPrice * amount),
        data: theContract.methods
          .mintpassMint(amount, v, r, s, amount_allowed, free)
          .encodeABI(),
      };
      try {
        web3.eth.sendTransaction(transactionParameters, function (err, txHash) {
          if (err) {
            console.log(err);
          } else {
            $(".alert").show();
            $(".alert").text("Your mint has been started! You can check the ");
            $(".alert").append(
              `<a class="tx_link" href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
            );
            //show the loading animation when user mints and confirms the mint
            $(".loading-tnx-status").show();
            //check the status
            checkTnxStatus(txHash);

            notifier.success(
              `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
            );
            console.log(txHash);
          }
        });
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
        `You are not on the allowlist for our pre-sale. The public sale starts on May 13th, 6pm GMT.`
      );
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

/**
 * @function public_mint
 * @param {*} amount
 * @description Allows user to mint nfts on public sale
 */

export const public_mint = async (amount) => {
  if (provider != null) {
    window.contract = new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      from: firstAccount[0],
      to: contractAddress,
      value: web3.utils.toHex(_publicMint * amount),
      data: theContract.methods.publicMint(amount).encodeABI(),
    };
    try {
      web3.eth.sendTransaction(transactionParameters, function (err, txHash) {
        if (err) {
          console.log(err);
        } else {
          //show the loading animation when user mints and confirms the mint
          $(".loading-tnx-status").show();

          //check the tnx status and display animations using this func below
          checkTnxStatus(txHash);

          $(".alert").show();
          $(".alert").text("Your mint has been started! You can check the ");
          $(".alert").append(
            `<a class="tx_link" href='https://etherscan.io/tx/${txHash}' target='_blank'>progress of your transaction.</a>`
          );
          notifier.success(
            `The transaction is initiated. You can view it here: <a target='_blank' href='https://etherscan.io/tx/${txHash}'> Etherscan</a>`
          );
          console.log(txHash);
        }
      });
    } catch (error) {
      if (error.code == 4001) {
        $(".alert").show();
        console.log(error.message);
        //   $(".alert").text(`The transaction was aborted`);
        notifier.alert("The transaction was aborted!");
      } else if (error.code == 4100) {
        $(".alert").show();
        console.log(error.message);
        notifier.warning(
          "The requested method and/or account has not been authorized by the user."
        );
      } else if (error.code == 4200) {
        $(".alert").show();
        console.log(error.message);
        notifier.warning("The Provider does not support the requested method.");
      } else if (error.code == 4900) {
        $(".alert").show();
        console.log(error.message);
        notifier.warning("The Provider is disconnected from all chains.");
      } else if (error.code == 4901) {
        $(".alert").show();
        console.log(error.message);
        notifier.warning(
          "The Provider is not connected to the requested chain."
        );
      } else {
        $(".alert").show();
        console.log(error.message);
        $(".alert").text(
          "We are sorry, but an unspecified error with your wallet provider has occured."
        );
      }
    }
  } else {
    $(".alert").show();
    notifier.warning("Please first connect your wallet");
  }
};

/**
 * @function checkTnxStatus
 * @params {tnxhash}
 * @sets Bool
 */

const checkTnxStatus = (hash) => {
  statusChecker([hash], "rinkeby")
    .then((result) => {
      console.log("output", result);
      let { Status } = result[0];
      console.log(Status);
      if (Status == null) {
        checkTnxStatus(hash);
      } else if (Status == true) {
        let tx_sending = document.getElementsByClassName("tx_sending");
        tx_sending[0].style.display = "none";
        let tx_success = document.getElementsByClassName("tx_success");
        tx_success[0].style.display = "grid";
      } else if (Status == false) {
        let tx_sending = document.getElementsByClassName("tx_sending");
        tx_sending[0].style.display = "grid";
        let tx_success = document.getElementsByClassName("tx_success");
        tx_success[0].style.display = "none";
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
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
