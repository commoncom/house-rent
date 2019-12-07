let RegisterFun = require("./get_register.js");


RegisterFun.initReg().then(con => {
	// console.log(con.methods)
	let addr = "0xaDCe9984d4d2E3936A0eB6F21a6105217a3E8766";
	// isExitUserAddress(con, addr).then(res => {
	// 	console.log(res)
	// });
	let priKey = "0x36923250A8BF14292202A7932DA90A3222560E8FF3C0426FC6B6199F1EE29023";
	let username = "zs";
	let pwd = "123";
	let addr2 = "0x5b0ccb1c93064Eb8Fd695a60497240efd94A44ed";
	let priKey2 = "0x502D29356356AE02B7E23ECC851CCA0F21FE9CDADEF1FBAB158EB82611F27229";
	let username2 = "ym";
	let addr4 = "0xcb1a734d3b8594d8e1b0bfbcdae08ff356412aa8";
	let priKey4 = "0xd10e652d28ce372182988f9de1064637380fe6310752efcfcbe120aedc347543";
	let username4 = "best2071";
	// let pwd = "pwd";
	// RegisterFun.login(con, priKey4, addr4, username4, pwd).then((res, rej) => {
	// 	console.log(4343, res);
	// 	RegisterFun.isLogin(con, addr4).then(res => {
	// 		console.log("isLogin", 444, res)
	// 	});
	// });
	let addr3 = "0xcb1a734d3b8594d8e1b0bfbcdae08ff356412aa8";
	let priKey3 = "0x052719F3BB83E6081F064CBF4A2087067CD55F088404D0A20DB5CDCB075D867B";
	let username3 = "ym2"; 
	// login(con, priKey3, addr3, username3, pwd).then((res, rej) => {
	// 	console.log(4343, res);
	RegisterFun.isLogin(con, addr3).then(res => {
		console.log("isLogin", 444, res)

	});
	// });
	// logout(con, priKey, addr, username, pwd).then((res, rej) => {
	// 	console.log(res);
	// });
	// findUserInfo(con, addr).then(res => {
	// 	console.log(res);
	// })
	// let addr3 = "0x7c943AAd08FE4FAC036FD8185Db145ae88dE1bb3";
	// getFalg(con).then(res => {

	// })
	// isLogin(con, addr3).then(res => {
	// 	console.log("isLogin", 444, res)
	// 	getFalg(con).then(res => {

	// 	})
	// });
});