const allowlist = require("../outputData/output_allowlist.json");
const cyclops = require("../outputData/output_cyclops.json");

//console.log(allowlist);

const calculateAllowedMint = () => {
  let allowlistMint_num, cyclops_mint_num;

  let userAddr = "0xA030ed6d2752a817747a30522B4f3F1b7f039c81";

  allowlistMint_num =
    allowlist[userAddr] != undefined ? allowlist[userAddr] : undefined;
  cyclops_mint_num =
    cyclops[userAddr].qty_allowed != undefined ? cyclops[userAddr] : undefined;
  console.log(allowlistMint_num, cyclops_mint_num);
};

calculateAllowedMint();
