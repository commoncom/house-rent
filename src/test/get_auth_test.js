let authFun = require("../get_auth.js");
authFun.initAuth().then(con => {
	let houseId= "0x92d93a3696039fb9719e63d1cc72827cc3e8405549f654c4bfd780c9f5a85d63";
	let addr = "0x12bb671c44c2593efaae0108d4db4b838792c3cc";
	authFun.getHouseOwer(con, houseId, addr).then((res, rej) => {
		console.log(4343, res);
	});
});