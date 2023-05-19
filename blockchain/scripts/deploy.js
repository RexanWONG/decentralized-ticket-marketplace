const hre = require("hardhat");

async function main() {
  const TicketMarketplace = await hre.ethers.getContractFactory("TicketMarketplace");
  const ticketMarketplace = await TicketMarketplace.deploy();

  await ticketMarketplace.deployed();

  console.log(
    `Contract deployed to ${ticketMarketplace.address} woohoo 🚀`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
