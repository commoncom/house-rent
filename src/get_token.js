let getContract = require("./common/contract_com.js").GetContract;
let filePath = "./ethererscan/token_abi.json";
let web3 = require("./common/contract_com.js").web3;
let comVar = require("./common/globe.js");
let contractAddress = comVar.tokenConAddr;
let Web3EthAbi = require('web3-eth-abi');
let nonceMap = new Map();

async function initToken() {
  let contract = await getContract(filePath, contractAddress);
  return contract;
}

function getBalance(contract, addr) {
  return new Promise((resolve, reject) => {
    console.log("enter into get balance")
    contract.methods.balanceOf(addr).call().then(res => {
      console.log("get the balance",res);
      resolve({status: true, data: res});
    }).catch(err => {
      console.log("get bal error:",err);
      reject({status: false, err: "未获取到余额!"});
    });
  });
}

function getAllBalance(contract, addr) {
   return new Promise((resolve, reject) => {
      contract.methods.balanceOf(addr).call().then(res => {
        console.log("get the balance",res);
        web3.eth.getBalance(addr).then(bal => {
            let tokenBal, ethBal;
            if (res && bal) {
               tokenBal = parseFloat(res.slice(0, -6))/100;
               ethBal = parseFloat(bal.slice(0, -10))/100000000;
            }
            console.log(res, 11, bal, 11, tokenBal, ethBal)
            resolve({status: true, data: {"ethbal": ethBal, "tokenbal": tokenBal}});
        }).catch(err => {
          console.log("get bal error:",err);
          reject({status: false, err: "未获取到余额!"});
        });
      }).catch(err => {
        console.log("get bal error:",err);
        reject({status: false, err: err});
      });
   });
}
// initToken().then(con => {
//    let to = "0x41f893cb802cf8d6f3c815490126c12716f0d365";
//    // let from = "0xaDCe9984d4d2E3936A0eB6F21a6105217a3E8766";
//    let addr = "0xaDCe9984d4d2E3936A0eB6F21a6105217a3E8766";
//    let spender = "0xaDCe9984d4d2E3936A0eB6F21a6105217a3E8766";
//    let prk2="0x36923250a8bf14292202a7932da90a3222560e8ff3c0426fc6b6199f1ee29023";
//    transferToken(con, addr, to, 5000, spender, prk2).then(res => {
//       console.log(res.transactionHash);
//    });
//    // transferApprove(con, spender, 2000, addr, prk2).then(res => {
//    //     console.log(receipt.transactionHash);
//    // });
// });
/**
* des: initAddr: 若是普通转账则与from相同；若是授权后的转账，则与from不同 
*/
//  // from: 转出账户， to: 转入账户， spender: 手续费支付方
function transferToken(contract, from, to, amount, spender, privateKey) {
  return new Promise((resolve, reject) => {
      // amount = amount * 100000000;
      let transfer_amount = amount + '00000000';
      console.log("start token transfer");
      const transFun = contract.methods.transferFrom(from, to, transfer_amount);
      const transABI = transFun.encodeABI();
      packSendMsg(spender, privateKey, contractAddress, transABI).then(receipt => {
          if (receipt) {
            console.log("Transfer success!");
            let [flag, ctx, logRes] = decodeLog(contract, receipt, 'Transfer');
                if (flag) {
                  console.log("Transfer receive: ", ctx)
                  resolve({status:flag, data: ctx.transactionHash});
                } else {
                  resolve({status:false, err:JSON.stringify("转账失败!")});
                }
          } 
      }).catch(err => {
          console.log("transfer token error!", err);
          reject({status: false, err: JSON.stringify(err)});
      });     
  });
}

function transferEth(contract, to, amount, from, privateKey) {
  return new Promise((resolve, reject) => {
      let gas, nonce;
      gas = 30000000000;
      console.time("trans eth")
      console.log("start transfer eth");
      web3.eth.getTransactionCount(from, 'pending').then(_nonce => {
          if (nonceMap.has(from) && (nonceMap[from] == _nonce)) {
             _nonce += 1
          }
          nonceMap.set(from, _nonce);
          nonce = _nonce.toString(16);
          const txParams = {
              gasPrice: gas,
              gasLimit: 210000,
              to: to,
              from: from,
              chainId: 3,
              value: web3.utils.toWei(amount+'', 'ether'),
              nonce: '0x' + nonce
          }
          console.log("signTransaction eth", txParams);
          web3.eth.accounts.signTransaction(txParams, privateKey).then(signedTx => {
              console.log("sendSignedTransaction eth");
              web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(receipt => {
                console.log("transfer result: ", receipt);
                if (receipt.status) {
                  console.log("transfer success!", receipt);
                  resolve({status: true, data: receipt.transactionHash});
                } else {
                  resolve({status: false, err: JSON.stringify("未获取正确的返回!")});
                }
                console.timeEnd("trans eth")
              }).catch(err => {
                console.log("send",console.log(typeof(err)), console.table(err))
                console.log("Send Error", JSON.stringify(err)=='{}', 111, err);
                if (JSON.stringify(err) == '{}') {
                    resolve({status: false, err: JSON.stringify("余额不足，发送失败!")});
                } else {
                   resolve({status: false, err: JSON.stringify(err)});
                }
              });
          }).catch(err => {
                console.log("signTransaction Error", err);
                reject({status: false, err: JSON.stringify(err)});
          });  
      }).catch(err => {
            console.log("getTransactionCount Error", err);
            if (JSON.stringify(err) == '{}') {
              resolve({status: false, err: JSON.stringify("网络异常!")});
            } else {
               resolve({status: false, err: JSON.stringify(err)});
            }
      });       
  });
}
// Call one for every contract
function transferApprove(contract, spender, amount, from, privateKey) {
  return new Promise((resolve, reject) => {
      console.log("start approve transfer", spender);
      amount = amount*100000000;
      const transFun = contract.methods.approve(spender, amount);
      const transABI = transFun.encodeABI();
       packSendMsg(from, privateKey, spender, transABI).then(receipt => {
          if (receipt) {
                console.log("Approve success!", receipt);
                resolve({status:true, data: receipt.transactionHash});
          } 
      }).catch(err => {
          console.log("approve transfer token error!", err);
          reject({status: false, err: err});
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
      gas = 30000000000;
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

module.exports = {
    initToken,
    getBalance,
    transferToken,
    transferApprove,
    getAllBalance,
    transferEth
}
