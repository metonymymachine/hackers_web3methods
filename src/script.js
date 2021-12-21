//import libs
import Onboard from "bnc-onboard";
import Web3 from "web3";
import { abi } from "./abi";
import $ from "jquery";
import { addresses } from "./whiteListed";
var WAValidator = require("wallet-validator");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(
  "wss://eth-mainnet.alchemyapi.io/v2/jteXmFElZcQhvSIuZckM-3c9AA-_CrcC"
);
let web;

//configs
const FORTMATIC_KEY = "pk_live_7CFC103369096AD4";
const PORTIS_KEY = "Your Portis key here";
const INFURA_KEY = "5b3b303e5c124bdfb7029389b1a0d599";
const APP_URL = "https://www.bobocomics.xyz";
const CONTACT_EMAIL = "dev@metonymy-machine.com";
const RPC_URL = `https://mainnet.infura.io/v3/${INFURA_KEY}`;
const APP_NAME = "onboardjs";

//merkletree config
const whitelistAddresses = addresses;

const leafNodes = whitelistAddresses.map((addr) =>
  //format to checksum address and apply keccak256 hash
  keccak256(web3.utils.toChecksumAddress(addr))
);
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
  //  duplicateOdd: true,
});

//wallet options to provide to users
const wallets = [
  { walletName: "metamask", preferred: true },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true,
  },
];

//onboarjs setup
export const onboard = Onboard({
  dappId: "e57157dd-aa3a-4b2a-a88d-36520d0193d9", // [String] The API key created by step one above
  networkId: 1, // [Integer] The Ethereum network ID your Dapp uses.
  subscriptions: {
    wallet: (wallet) => {
      web = new Web3(wallet.provider);
    },
  },
  walletSelect: {
    explanation:
      "We do not own your private keys and cannot access your funds without your confirmation.",
    wallets: wallets,
  },
});

const contractABI = abi;
const contractAddress = "0xF970F7e6FF8217dD8653d71F7b0071b7F8DE5182";

const theContract = new web3.eth.Contract(contractABI, contractAddress);

const publicprice = "50000000000000000";
const presaleprice = "37500000000000000";

const loadCurrentSupply = async () => {
  const supply = await theContract.methods.getCurrentId().call();

  return supply;
};

//Get the supply and attach
//run this function every 3 sec
//class required to display would be .supply
setInterval(() => {
  loadCurrentSupply()
    .then((val) => {
      $(".supply").text(`${6666 - val}/6.666`);
      console.log(val, "Running supply");
    })
    .catch((err) => {
      console.log(err);
      $(".supply").text("Sorry error occured!");
    });
}, 3000);

export const loadPreSaleStatus = async () => {
  const preSaleActive = await theContract.methods.PresaleIsActive.call()
    .call()
    .then(function (res) {
      return res.toString();
    });
  $(".pre_sale_status").text(`${preSaleActive}`);
};

//sale status
export const loadSaleStatus = async () => {
  const SaleActive = await theContract.methods.saleIsActive
    .call()
    .call()
    .then(function (res) {
      return res.toString();
    });
  $(".sale_status").text(`${SaleActive}`);
};

//get root
export const get_root = async () => {
  const root = await theContract.methods.root
    .call()
    .call()
    .then(function (res) {
      return res.toString();
    });
  $(".root").text(`${root}`);
};

const loadBalanceContract = async () => {
  const balanceContractWei = await web3.eth
    .getBalance(contractAddress)
    .then(function (res) {
      return res.toString();
    });
  const balanceContract = web3.utils.fromWei(balanceContractWei, "ether");
  return balanceContract;
};

export const connectWallet = async () => {
  await onboard.walletSelect();
  await onboard.walletCheck();

  //check if user address if whitelisted alse display a message
  let addr = keccak256(
    web3.utils.toChecksumAddress(onboard.getState().address)
  );
  let proof = merkleTree.getHexProof(addr);

  if (proof.length == 0) {
    $(".whitelist-alert").text(
      "Sorry, your wallet is not whitelisted for the pre-sale. The public sale starts on December 23rd"
    );
    $(".whitlist-check").hide();
  }

  if (proof.length > 0) {
    $(".whitelist-alert").text(
      "Your wallet is whitelisted for the pre-sale. You can mint up to 3 x Bobos."
    );
    $(".whitlist-check").hide();
  }

  //window.alert(onboard.getState().address);
  $(".metamask-button-text").text(
    `Connected (${onboard.getState().address.substring(0, 2)}...${onboard
      .getState()
      .address.slice(onboard.getState().address.length - 2)})`
  );
  //hide please connect wallet text
  $(".test-metamask-button").text(`${onboard.getState().address}`);
};

export const walletReset = () => {
  onboard.walletReset();
};

export const walletState = () => {
  const currentState = onboard.getState();

  console.log(currentState);
  return currentState;
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      $(".alert").text(`${err.message}`);
    }
  } else {
    $(".alert").text("Please connect a wallet");
  }
};

export const mintPresale = async (amount) => {
  //check if onboard address is empty then connect wallet
  if (onboard.getState().address) {
    //grab the connected address
    //convert to checkum format
    //apply keccak256
    //return as a claiming address to find the proof
    const claimingAddress = keccak256(
      web3.utils.toChecksumAddress(onboard.getState().address)
    );

    //get the root for the whitelisted address
    const hexProof = merkleTree.getHexProof(claimingAddress);

    //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
    const transactionParameters = {
      from: onboard.getState().address,
      to: contractAddress,
      value: web3.utils.toHex(presaleprice * amount),
      data: theContract.methods.mintPresale(amount, hexProof).encodeABI(),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      $(".alert").show();
      $(".alert").text(
        "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
          txHash
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
    connectWallet();

    console.log("connecting wallet...");
  }
};

//bunle price minting
export const mintBundlePrice = async (amount) => {
  //grab the connected address
  //convert to checkum format
  //apply keccak256
  //return as a claiming address to find the proof
  const claimingAddress = keccak256(
    web3.utils.toChecksumAddress(onboard.getState().address)
  );

  //get the root for the whitelisted address
  const hexProof = merkleTree.getHexProof(claimingAddress);
  //custom bundle price for 3 bobos
  let bundlePrice = "100000000000000000";
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: onboard.getState().address,
    to: contractAddress,
    value: web3.utils.toHex(bundlePrice),
    data: theContract.methods.mintPresale(amount, hexProof).encodeABI(),
  };
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    $(".alert").show();
    $(".alert").text(
      "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
        txHash
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

export const mintPublic = async (amount) => {
  //  window.contract = new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    from: onboard.getState().address,
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
    $(".alert").text(
      "The transaction has been confirmed. You can view it here: https://etherscan.io/tx/" +
        txHash
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
        //just to check if address is whitelisted or not
        setTimeout(() => {
          whitListAlert();
        }, 2000);
        console.log(useraddress);
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

//show the whitelist alert
const whitListAlert = () => {
  //check the whitlist of account
  //check if user address if whitelisted alse display a message
  let addr = keccak256(
    web3.utils.toChecksumAddress(onboard.getState().address)
  );
  let proof = merkleTree.getHexProof(addr);

  if (proof.length == 0) {
    $(".whitelist-alert").text(
      "Sorry, your wallet is not whitelisted for the pre-sale. The public sale starts on December 23rd"
    );
    $(".whitlist-check").hide();
  }

  if (proof.length > 0) {
    $(".whitelist-alert").text(
      "Your wallet is whitelisted for the pre-sale. You can mint up to 3 x Bobos."
    );
    $(".whitlist-check").hide();
  }
};
