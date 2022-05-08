const fs = require("fs");
const input_allowlist_raw = require("../../inputData/input_allowlist_raw.json");
const input_claimList_raw = require("../../inputData/input_claimList_raw.json");

//get json keys array to loop thru and get the values and formate
let allow_list_keys = Object.keys(input_allowlist_raw);
let allow_list_arr = [];

allow_list_keys.forEach((e, i) => {
  //console.log(input_allowlist_raw[e]);
  let obj = {
    addr: e,
    free: 0,
    qty_allowed: 4, //input_allowlist_raw[e],
  };
  allow_list_arr.push(obj);

  if (i + 1 == allow_list_keys.length) {
    console.log(allow_list_arr);
    // stringify JSON Object
    var jsonContent_allow = JSON.stringify(allow_list_arr);
    //console.log(jsonContent);

    fs.writeFile(
      "../../inputData/input_allowlist_clean.json",
      jsonContent_allow,
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

//get json keys array to loop thru and get the values and formate
let cyclops_keys = Object.keys(input_claimList_raw);
let cyclops_arr = [];

console.log(cyclops_keys, "****************");
cyclops_keys.forEach((e, i) => {
  //console.log(input_claimList_raw[e]);
  let obj = {
    addr: e,
    free: 1,
    qty_allowed: input_claimList_raw[e],
  };

  cyclops_arr.push(obj);

  if (i + 1 == cyclops_keys.length) {
    console.log(cyclops_arr);
    // stringify JSON Object
    var jsonContent_Cyclops = JSON.stringify(cyclops_arr);
    //console.log(jsonContent);

    fs.writeFile(
      "../../inputData/input_claimList_clean.json",
      jsonContent_Cyclops,
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
