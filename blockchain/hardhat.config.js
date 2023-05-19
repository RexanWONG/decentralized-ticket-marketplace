require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config()

module.exports = {
  solidity: "0.8.14",
  networks: {
    sepolia: {
      url: process.env.URL,
      accounts: [process.env.PRIVATE_KEY]
    }
      
  }
};
