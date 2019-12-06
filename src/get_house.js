let getContract = require("./common/contract_com.js").GetContract;
let filePath = "./ethererscan/house_abi.json";
let web3 = require("./common/contract_com.js").web3;
let Web3EthAbi = require('web3-eth-abi');
let comVar = require("./common/globe.js");
let dbFun = require("./db/house.js");
let nonceMap = new Map();
let RegisterFun = require("./get_register");
let TokenFun = require("./get_token");
let contractAddress = comVar.houseConAddr;
async function initHouseFun() {
	let contract = await getContract(filePath, contractAddress);
	return contract;
}
// initHouseFun().then(con => {
// 	let addr = "0xaDCe9984d4d2E3936A0eB6F21a6105217a3E8766";	
// 	let priKey = "0x36923250A8BF14292202A7932DA90A3222560E8FF3C0426FC6B6199F1EE29023";
// 	let username = "zs";
// 	let houseAddr = "It lies in SanFan, the beautiful city!";
// 	let des = "It's very beautiful, and it has a lot of fun";
// 	let info = "Greate info";
// 	let hopeCtx = "Hope you are easygoing";
// 	// releaseHouse(con, addr, priKey, houseAddr, 5, des, info, 12, 320000000000, hopeCtx).then(res => {
// 	// 	if (res) {
// 	// 		console.log(res);
// 	// 	}
// 	// });
// 	// house id : 0x2a43eecd35d6b76aef7c08c9ab761ae366bd19018492fe8de12799ec342ac69f
// 	let addr2 = "0x5b0ccb1c93064Eb8Fd695a60497240efd94A44ed";
// 	let priKey2 = "0x502D29356356AE02B7E23ECC851CCA0F21FE9CDADEF1FBAB158EB82611F27229";

// 	let houseId = "0x94efed96b0fa279522423d1a558ea49dfdc4c17186dadfe59657aa9d73f3f6ff";
// 	let realRent = 320000000000;
// 	// requestSign(con, addr2, priKey2, houseId, realRent).then(res => {
// 	// 	if (res) {
// 	// 		console.log(res);
// 	// 	}
// 	// });
// 	let signHowLong = 12;
// 	let rental = 320000000000;
// 	let yearRent = signHowLong*rental;
// 	let username2 = "ym";
// 	// signAgreement(con, addr, priKey, houseId, username, signHowLong, rental, yearRent).then(res => {
// 	// 	console.log(res)
// 	// })
// 	let addrChecker = "0x8E0f4A1f3C0DBEA0C73684B49aE4AD02789B3EC4";
// 	let priKeyChecker = "0xFFE962244D80F95197089FE5FF87BE0163D485E7986A7070A498136012FD7B61";
// 	let punishAmount = 5000000000;
// 	let punishAddr = addr;
// 	let reason = "Donnt observe the rule2";
// 	// checkBreak(con, addrChecker, priKeyChecker, houseId, punishAmount, punishAddr).then(res => {
// 	// 	console.log(res)
// 	// });
// 	// breakContract(con, addr2, priKey2, houseId, reason).then(res => {

// 	// });
// 	let amount = 2000000000;
// 	// withdraw(con, addr2, priKey2, houseId, amount).then(res => {

// 	// });
// 	let ratingIndex = 3;
// 	let remark = "It is very good.";
// 	// const disRrkAddr = "0x16c0b9cb893BA4392131df01e70F831A07d02687";
// 	commentHouse(con, addr2, priKey2, houseId, ratingIndex, remark).then(res => {

// 	});
// 	// getHouseRelaseInfo(con, houseId).then(res => {
// 	// 	console.log(res)
// 	// })
// });

function checkLogin(addr) {
	// 必须先登录
	return new Promise((resolve, reject) => {
		RegisterFun.initReg().then(con => {
			RegisterFun.isLogin(con, addr).then(res => {
				resolve(res);
			}).catch(err1 => {
				console.log("checkLogin error", err1);
				reject(err1)
			});
		}).catch(err => {
			console.log("Register init fail", err);
			reject(err);
		});
	});
}

function releaseHouse(db, contract, contractToken, addr, privateKey, houseAddr, huxing, des, info, tenancy, rent, hopeCtx) {
	return new Promise((resolve, reject) => {
		console.log("release===")
		contractToken.then(con => {
			console.log(addr.length, addr);
			TokenFun.getBalance(con, addr).then(bal => {
				console.log("bal", bal, typeof(bal), bal.length)
				let n = bal.length;
				let newBal;
				if (n > 6) {
				   let temp = bal.slice(0, -6);
				   let newBal = parseFloat(temp);
				   console.log("After parese value", temp, newBal);
				   if (newBal < comVar.promiseAmount) {
				   		resolve({status: false, err: "RentToken数量不能满足保证金要求!余额为："+newBal})
				   } else {
				   	  console.log("---start release house---")
					  checkLogin(addr).then(flag => {
						if (!flag) {
							console.log("Please login in first");
							resolve({status: false, err: "该用户未登录，请先登录!"});
						} else { // TokenFun
							const releaseFun = contract.methods.releaseHouse(houseAddr, huxing, des, info, tenancy, rent, hopeCtx);
				    		const relABI = releaseFun.encodeABI();
						    packSendMsg(addr, privateKey, contractAddress, relABI).then(receipt => {
					        	if (receipt) {
					        		console.log("Release house success!");
					        		let tx_hash="", house_hash="";
					        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'RelBasic');
				                    if (flag) {
				                    	console.log("release house receive: ", ctx, logRes);
				                    	tx_hash = ctx.transactionHash;
				                    	house_hash = logRes.houseHash;
				                    	console.log("===house_hash==", logRes, house_hash)
				                    	resolve({status:flag, data:{trans: ctx.transactionHash, houseId: logRes.houseHash}});
				                    } else {
				                    	resolve({status:false, err:"发布房源失败!"});
				                    } 
				                    const house_state = comVar.houseState.Release;
				                    console.log("house state:", house_state, house_hash);
				                    dbFun.insertRealseInfo(db, "", addr, houseAddr, huxing, des, info, tenancy, rent, hopeCtx, house_state, tx_hash, house_hash);
					        	}
							}).catch(err => {
								console.log("Release fail!", err);
								reject({status:false, err:"请检查房屋是否已认证，余额是否满足保证金最少要求！"});
							});
						}
					}).catch(err1 => {
			           console.log("Create user error", err1);
			           reject({status:false, err:"网络繁忙，请稍后重试!"});
			        });
				   }
				} else {
					resolve({status: false, err: "RentToken余额不能满足发布房屋保证金的要求！"})
				}
			}).catch(err => {
				console.log("get balance parse error", err);
				reject({status: false, err: err});
			})
		});
	});
}

function requestSign(contract, addr, privateKey, houseId, realRent) {
	return new Promise((resolve, reject) => {
		// Judge whether the user has logged in
		checkLogin(addr).then(flag => {
			if (!flag) {
				console.log("Please login in first");
				resolve({status: false, err: "请先登录！"});
			} else {
				console.log("=request sign=", houseId, realRent);
				const reqFun = contract.methods.requestSign(houseId, realRent);
			    const reqABI = reqFun.encodeABI();
			    console.log("Start request!", addr);
			    packSendMsg(addr, privateKey, contractAddress, reqABI).then(receipt => {
		        	if (receipt) {
		        		console.log("Request the house success!");
		        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'RequestSign');
	                    if (flag) {
	                    	console.log("request house receive: ", ctx)
	                    	resolve({status:flag, data: ctx.transactionHash});
	                    } else {
	                    	resolve({status:false, err:"请求签订房源失败!"});
	                    } 
		        	} else {
		        		console.log("Release house fail!");
		        		resolve({status:false, err:"请求签订房源失败!"});
		        	}
				}).catch(err => {
					console.log("Release fail!", err);
					reject({status: false, err: err});
				});
			}
		});
		
	});
}

// function signAgreement(contract, addr, privateKey, houseId, name, signHowLong, rental, yearRent) {
function signAgreement(contract, username, houseId, houseAddr, falsify, phoneNum, idCard, signHowLong, rental, houseDeadline, addr, privateKey) {	
	return new Promise((resolve, reject) => {
		console.log("==start=signAgreement=")
		let yearRent = 12*rental;
		const reqFun = contract.methods.signAgreement(houseId, username, signHowLong, rental, yearRent);
	    const reqABI = reqFun.encodeABI();
	    console.log("Start sign the agreement!", addr);
	    packSendMsg(addr, privateKey, contractAddress, reqABI).then(receipt => {
        	if (receipt) {
        		console.log("Sign success!");
        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'SignContract');
                if (flag) {
                	console.log("request house receive: ", ctx)
                	resolve({status:flag, data: ctx.transactionHash});
                } else {
                	resolve({status:false, err:"签订合同失败!"});
                }
        	} 
		}).catch(err => {
			console.log("Sign fail!", err);
			reject({status: false, err: "请检查是否已经登录、余额能否满足租金要求、是否已预订该房屋！"});
		});
	});
}


function withdraw(contract, addr, privateKey, houseId, amount) {
	return new Promise((resolve, reject) => {
		const withFun = contract.methods.withdraw(houseId, amount);
	    const withABI = withFun.encodeABI();
	    packSendMsg(addr, privateKey, contractAddress, withABI).then(receipt => {
        	if (receipt) {
        		console.log("Withdraw the coin success!");
        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'WithdrawDeposit');
                if (flag) {
                	console.log("withdraw the promise receive: ", ctx)
                	resolve({status:flag, data: ctx.transactionHash});
                } else {
                	resolve({status:false, err:"退款失败!"});
                }
        	} 
		}).catch(err => {
			console.log("Withdraw occure error!");
			reject({stats: false, err: err});
		});
	});
}

function breakContract(contract, addr, privateKey, houseId, reason) {
	return new Promise((resolve, reject) => {
		checkLogin(addr).then(flag => {
			if (!flag) {
				console.log("Please login in first");
				resolve(false);
			} else {
				const reqFun = contract.methods.breakContract(houseId, reason);
			    const reqABI = reqFun.encodeABI();
			    console.log("Start Break the contract!", addr);
			    packSendMsg(addr, privateKey, contractAddress, reqABI).then(receipt => {
		        	if (receipt) {
		        		web3.eth.getTransactionReceipt(receipt.transactionHash).then(transaction => {
		        			  console.log("getTransactionReceipt", transaction);
		        			  if (transaction.status) {
		        			  	 console.log("Break Contract success!");
		        			  } else {
		        			  	reject(false);
		        			  }
		        		});
		        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'BreakContract');
		                if (flag) {
		                	console.log("Break the contract receive: ", ctx)
		                	resolve({status:flag, data: ctx.transactionHash});
		                } else {
		                	resolve({status:false, err:"毁约失败!"});
		                }
		        	}
				}).catch(err => {
					console.log("Break the contract occure error!, Please inspect whether already pass the admin check!");
					reject({stats: false, err: "请检查是否已经通过管理员审核！"});
				});
			}
		});
	});
}

function checkBreak(contract, addr, privateKey, houseId, punishAmount, punishAddr) {
	return new Promise((resolve, reject) => {
		checkLogin(addr).then(flag => {
			if (!flag) {
				console.log("Please login in first");
				resolve(false);
			} else {
				const reqFun = contract.methods.checkBreak(houseId, punishAmount, punishAddr);
			    const reqABI = reqFun.encodeABI();
			    console.log("Start Check Break the contract!", addr);
			    packSendMsg(addr, privateKey, contractAddress, reqABI).then(receipt => {
		        	if (receipt) {
		        		console.log("Check Break Contract success!");
		        		let [flag, ctx, logRes] = decodeLog(contract, receipt, 'ApprovalBreak');
		                if (flag) {
		                	console.log("Check Break the contract receive: ", ctx)
		                	resolve({status:flag, data: ctx.transactionHash});
		                } else {
		                	resolve({status:false, err:"审核交易审核失败!"});
		                }
		        	} 
				}).catch(err => {
					console.log("Check Break the contract occure error!", err);
					reject({status: false, err: err});
				});
			}
		}).catch(err => {
			reject({status: false, err: err});
		});
	});
}

function commentHouse(contract, addr, privateKey, houseId, ratingIndex, remark) {
	return new Promise((resolve, reject) => {
		checkLogin(addr).then(flag => {
			if (!flag) {
				console.log("Please login in first");
				resolve(false);
			} else {
				TokenFun.initHouseFunToken().then(con => {
					TokenFun.approveTransfer(con, comVar.disAddr, comVar.privKey, addr, comVar.disAmount).then((res, rej) => {
						console.log(res, addr)
						if (res) {
							const reqFun = contract.methods.commentHouse(houseId, ratingIndex, remark);
						    const reqABI = reqFun.encodeABI();
						    console.log("Start comment the house!", addr);
						    packSendMsg(addr, privateKey, contractAddress, reqABI).then(receipt => {
					        	if (receipt) {
					        		console.log("Comment the house success!");
					        		const eventJsonInterface = contract._jsonInterface.find(
										o => (o.name === 'CommentHouse') && o.type === 'event');
									if (JSON.stringify(receipt.logs) != '[]') {
										const log = receipt.logs.find(
											l => l.topics.includes(eventJsonInterface.signature)
										)
										let houseRel = Web3EthAbi.decodeLog(eventJsonInterface.inputs, log.data, log.topics.slice(1))
						   				console.log(houseRel);
						   				resolve(receipt);
									}
					        	} else {
					        		console.log("Comment the house fail!");
					        	}
							}).catch(err => {
								console.log("Comment the house occure error!", err);
								reject(err);
							});
						}
					});
				}).catch(err => {
					 console.log("distribute reward approval fail", err);
					 reject(err);
				});
			}
		});
	});
}

function decodeLog(contract, receipt, eventName) {
	const eventJsonInterface = contract._jsonInterface.find(
      o => (o.name === eventName) && o.type === 'event');
    if (JSON.stringify(receipt.logs) != '[]') {
        const log = receipt.logs.find(
          l => l.topics.includes(eventJsonInterface.signature)
        );
        let decodeLog = Web3EthAbi.decodeLog(eventJsonInterface.inputs, log.data, log.topics.slice(1));
        console.log("==decode log==",decodeLog)
        return [true, receipt, decodeLog];
    } else {
      return [false, "Cannt find logs", {}];
    }
}

function packSendMsg(formAddr, privateKey, toAddr, createABI) {
		let gas, nonce;
		return new Promise((resolve, reject) => {
			gas = 20000000000;
			web3.eth.getTransactionCount(formAddr, 'pending').then(_nonce => {
				if (nonceMap.has(_nonce)) {
					_nonce += 1
				}
				nonceMap.set(_nonce, true);
				nonce = _nonce.toString(16);
				const txParams = {
				  gasPrice: gas,
			      gasLimit: 2000000,
			      to: toAddr,
			      data: createABI,
			      from: formAddr,
			      chainId: 3,
			      nonce: '0x' + nonce
				}
				console.log("start sign the transaction")
				web3.eth.accounts.signTransaction(txParams, privateKey).then(signedTx => {
					console.log("start send the transaction")
			 		web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(receipt => {
			 			if (receipt.status) {
			 				console.log(receipt.transactionHash)
			 				resolve(receipt);
			 			} else {
			 				reject("发送交易失败!");
			 			}
			 		}).catch(err1 => {
			 			console.log("Send Fail:", err1);
			 			reject(err1);
			 		});
				}).catch(err => {
		 			console.log("Sign Fail:", err);
		 			reject(err);
		 		});;
			}).catch(err => {
	 			console.log("GetTransactionCount Fail:", err);
	 			reject(err);
	 		});
		});	 	
}

function getHouseBasic(contract, houseId) {
	return new Promise((resolve, reject) => {
		contract.methods.getHouseBasicInfo(houseId).call().then(res => {
			console.log(res);
		}).catch(err => {
			console.log("get house basic information err:", err);
			reject(err);
		});
	});
}

function getHouseRelaseInfo(contract, houseId) {
	return new Promise((resolve, reject) => {
		contract.methods.getHouseBasicInfo(houseId).call().then(res => {
			console.log(res);
		});
	});
}

module.exports = {
	initHouseFun,
	releaseHouse,
	requestSign,
	signAgreement,
	withdraw,
	breakContract,
	checkBreak,
	commentHouse,
	getHouseBasic,
	getHouseRelaseInfo
}