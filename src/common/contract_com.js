const Tx = require('ethereumjs-tx');
var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2571ab4c0de14ffb87392fb9c3904375"));
// console.log(web3)

const fs = require("fs");
const readFile = require("util").promisify(fs.readFile);
const NoError = "";
async function run(filePath) {
  try {
      const fr = await readFile(filePath,"utf-8");
      return fr;
   } catch (err) {
      console.log('Read ABI Error', err);
   }    
}
// GetContract("../ethererscan/token_abi.json", "0xfed21ab2993faa0e0b2ab92752428d96370d4889").then(contract => {
// 	// console.log(contract)
// 	let addr = "0x5ea7f9bcb2a3a021fb0070540f9e56e515af1da9";
// 	contract.methods.balanceOf(addr).call().then(res => {
// 		console.log(res)
// 	});
// });
function GetContract(filePath, contractAddress) {
	return new Promise((resolve, reject) => {
		run(filePath).then(abi => {
			let objABI = JSON.parse(abi);
			// console.log(contractAddress)
			let contract = new web3.eth.Contract(objABI, contractAddress,{gasPrice: '3000000'});
			// console.log(contract)
			// var version = web3.version;
			// console.log(version);
			resolve(contract);
		}).catch(err => {
		   console.log("Read ABI Fail:", err);
		   reject(err);
		});
	});
}
// function run(filePath) {
//   try {
//       const fr = fs.readFileSync(filePath,"utf-8");
//       return fr;
//    } catch (err) {
//       console.log('Error', err);
//    }    
// }

// function GetContract(filePath, contractAddress) {
//     let abi = run(filePath);
// 	let objABI = JSON.parse(abi);
// 	let contract = new web3.eth.Contract(objABI, contractAddress,{gasPrice: '3000000'});
// 	return contract;
// }


module.exports = {
	GetContract,
	web3
}