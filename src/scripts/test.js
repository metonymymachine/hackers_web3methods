let firstAccount = ["0xA030ed6d2752a817747a30522B4f3F1b7f039c80"];
let MntPss = 0;

const signature_data_allowlist = require("../outputData/output_allowlist.json");

const signature_data_cyclops = require("../outputData/output_cyclops.json");
let string = JSON.stringify(signature_data_cyclops)
console.log(
 signature_data_cyclops[firstAccount[0]]
);

// if (
//   signature_data_allowlist[`${firstAccount[0]}`] != undefined &&
//   signature_data_cyclops[`${firstAccount[0]}`] != undefined
// ) {
//   //check if users owns a mntpass as well
//   if (MntPss > 0) {
//     amount_allowed = signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
//     amount_allowed_cy =
//       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
//     console.log("User is on allowlist & cyclops list");
//     //   $(".allow_list_text").text(
//     //     `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL. With your Mintpass you can additionally mint up to 10 Cyclops!
//     // `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("cyclops_allowed", amount_allowed_cy);
//     //   localStorage.setItem("allowlist_allowed", amount_allowed);
//     //   localStorage.setItem("mintpass_owner_owns", MntPss);
//   } else {
//     amount_allowed = signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
//     amount_allowed_cy =
//       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
//     console.log("User is on allowlist & cyclops list");
//     //   $(".allow_list_text").text(
//     //     `You can claim up to ${amount_allowed_cy} Cyclops in Specials Owner and mint ${amount_allowed} additional Cyclops in General WL!
//     // `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("cyclops_allowed", amount_allowed_cy);
//     //   localStorage.setItem("allowlist_allowed", amount_allowed);
//   }
// }
// //check if a person is only on the allowlist
// else if (signature_data_allowlist[firstAccount[0]] != undefined) {
//   //check if users owns a mntpass as well
//   if (MntPss > 0) {
//     amount_allowed = signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;

//     console.log("User is on mntpass & allow list");
//     //   $(".allow_list_text").text(
//     //     `You can ${amount_allowed} mint cyclops and you have a mintpass
//     //   `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("allowlist_allowed", amount_allowed);
//     //   localStorage.setItem("mintpass_owner_owns", MntPss);
//   } else {
//     amount_allowed = signature_data_allowlist[`${firstAccount[0]}`].qty_allowed;
//     console.log("User is only on allowlist no mntpass");
//     //   $(".allow_list_text").text(
//     //     `You can mint up to ${amount_allowed} Cyclops in General WL!
//     // `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("allowlist_allowed", amount_allowed);
//   }
// }

// // check if the person is ONLY on the Cyclops List
// else if (signature_data_cyclops[firstAccount[0]] != undefined) {
//   //check if users owns a mntpass as well
//   if (MntPss > 0) {
//     amount_allowed_cy =
//       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;

//     console.log("User is on mntpass & cyclops list");
//     //   $(".allow_list_text").text(
//     //     `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners and you can mint with your mintpass!
//     //   `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("cyclops_allowed", amount_allowed_cy);
//     //   localStorage.setItem("mintpass_owner_owns", MntPss);
//   } else {
//     amount_allowed_cy =
//       signature_data_cyclops[`${firstAccount[0]}`].qty_allowed;
//     console.log("User is only on cyclops list no mintpass");
//     //   $(".allow_list_text").text(
//     //     `You can mint up to ${amount_allowed_cy} Cyclops in Special Owners mint!
//     // `
//     //   );
//     //   //set allowed in ls
//     //   localStorage.setItem("cyclops_allowed", amount_allowed_cy);
//   }
// }

// // check if the person owns a mintpass
// else if (MntPss > 0) {
//   console.log("You own mintpass");
//   // code to check the mintpass owner balance
//   // // getDependentContractBal();
//   // localStorage.setItem("mintpass_owner_owns", MntPss);
//   // $(".allow_list_text").text(
//   //   `You can mint with your mintpass at a reduced price!`
//   // );
// } else {
//   // $(".allow_list_text").text(
//   //   `Your address is not included in the allowlist and you do not own a Mintpass. Join our Discord for the upcoming Public Raffle Sale.`
//   // );
//   console.log("Not in whitelist!");
// }
