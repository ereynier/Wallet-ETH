import { ethers, network } from "hardhat";

import { verify } from "../utils/verify";

async function main() {
  const Wallet = await ethers.getContractFactory("Wallet");
  const wallet = await Wallet.deploy()
  await wallet.deployed();

  console.log("Wallet deployed to:", wallet.address);

  if (network.name === "sepolia") {
    console.log("Verifying smartcontract on Etherscan");
    await wallet.deployTransaction.wait(6)
    await verify(wallet.address, []);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
