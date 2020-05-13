let Wallet = require('ethereumjs-wallet');
function generateAddress() {
	const wallet = Wallet.generate();
	let address = wallet.getAddressString();
	let prikey = wallet.getPrivateKeyString();
	console.log("address: " + address);
	console.log("privateKey: " + prikey);
    return [address, prikey];
}
function batchGene(n) {
	for(let i = 0; i < n; i++) {
		generateAddress()
	}
}
batchGene(7) 