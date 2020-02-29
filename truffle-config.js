const HDWalletProvider = require('@truffle/hdwallet-provider');
// 接下来，提供助记词（mnemonic）来生成你的账户。 進入 MetaMask -> Settings -> reveal seed words 复制到这里
//警告 ：在此过程中，我们强烈建议将助记符存储在另一个（秘密）文件中，以降低助记符泄漏风险。 如果有人知道你的助记符，他们将拥有你所有的地址和私钥！我这个地址是测试地址，没有主网的ETH代币，所以无所谓！

var mnemonic = "section achieve bright crowd garage similar couple plate check fury okay utility";

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
   development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
   },
   test: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
   },
   ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/2571ab4c0de14ffb87392fb9c3904375",0, 1, true, "m/44'/1'/0'/0/"),
      network_id: 3,
      gas: 6000000,
      gasPrice: 20000000000,
      skipDryRun: true  
   }
  },
  solc: {
    path: "soljson-v0.4.24-nightly.2018.4.20+commit.f328431.js",
    version: "^0.4.24",
    docker: false,
    parser: "solcjs", 
    settings: {
        optimizer: {
          enabled: true,
          runs: 200  // Optimize for how many times you intend to run the code
        },
        evmVersion: "petersburg"
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
