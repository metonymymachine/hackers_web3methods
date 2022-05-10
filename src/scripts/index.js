import {
  addWalletListener,
  connectWallet,
  loadPreSaleStatus,
  loadSaleStatus,
  allowlist_mint,
  togglePresale,
  toggleSale,
  walletReset,
  walletState,
  withdraw,
  allowListCounter,
  mintpassMint,
  claim,
  public_mint,
} from "./web3/script";

//connect to the wallet
global.connectWb3Wallet = () => {
  connectWallet();
};

//minting for whc claims
global.claim_mint = (amount) => {
  claim(amount);
};

//minting for general public
global.public_mint = (amount) => {
  public_mint(amount);
};

//Presale mint
global.allowlist_mint = (amount) => {
  allowlist_mint(amount);
};

//Presale mint
global.mint_pass_mint = (amount) => {
  mintpassMint(amount);
};

//wallet event listener
global.walletChanges = () => {
  addWalletListener();
};

//reset the walletxa
global.walletReset = () => {
  walletReset();
};

//toggle presale

global.toggle_presale = () => {
  togglePresale();
};

//toggle sale
global.toggle_sale = () => {
  toggleSale();
};

//withdraw
global.withdraw = () => {
  withdraw();
};

//presale and sale status
global.pre_sale_status = () => {
  loadPreSaleStatus();
};

//load sale status
global.sale_status = () => {
  loadSaleStatus();
};

//get root

global.root = () => {
  get_root();
};

global.state = () => {
  walletState();
};
