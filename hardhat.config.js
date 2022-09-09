require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ganache");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
         // evmVersion: 'istanbul'
        }
      },
      // {
      //   version: "0.8.4",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200
      //     },
      //    // evmVersion: 'istanbul'
      //   }
      // },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: 'istanbul'
        }
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: 'istanbul'
        }
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: 'istanbul'
        }
      },
    ],
  },
  networks: {
    eth: {
      url: process.env.ETH_URL || "",
      accounts:
        process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    testnet: {
      url: process.env.BSC_TESTNET || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.BSC_MAINNET || "",
      accounts: process.env.MAINNET_PRIVATE_KEY !== undefined ? [process.env.MAINNET_PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.POLY_MAINNET || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    matic: {
      url: process.env.POLY_MAINNET || "",
      accounts: process.env.TESTNET_PRIVATE_KEY !== undefined ? [process.env.TESTNET_PRIVATE_KEY] : [],
    },
    stardust: {
      url: "https://stardust.metis.io/?owner=588",
    },
    andromeda: {
      url: "https://andromeda.metis.io/?owner=1088",
    },
    hardhat: {
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: true,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
   // outputFile: 'gas-report.pdf',
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    currency: "USD",
  },
  etherscan: {
     apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: {
    //   stardust: process.env.ETHERSCAN_API_KEY,
    //   andromeda: process.env.ETHERSCAN_API_KEY,
    // },
    customChains: [
      {
        network: "andromeda",
        chainId: 1088,
        urls: {
          apiURL: "https://andromeda-explorer.metis.io",
          browserURL: "https://andromeda-explorer.metis.io",
        },
      },
      {
        network: "stardust",
        chainId: 588,
        urls: {
          apiURL: "https://stardust-explorer.metis.io",
          browserURL: "https://stardust-explorer.metis.io",
        },
      },
    ],
  },
};