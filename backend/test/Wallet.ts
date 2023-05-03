import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { Wallet } from "../typechain-types/Wallet";

describe("Wallet", function () {

  let token: Wallet;
  
  before(async function () {
    [this.owner, this.addr1, ...this.addrs] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");
    token = await Wallet.deploy();
  });

  describe("Get balance of user", function () {
    it("Should get the balance of the user", async function () {
      let getter = await token.getBalance();
      expect(getter).to.equal(0);
    });
  });

  describe("Deposit", function () {
    it("Should deposit 1000 wei", async function () {
      await token.deposit({ value: 1000 });
      let getter = await token.getBalance();
      expect(getter).to.equal(1000);
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw 500 wei", async function () {
      await token.withdraw(500);
      let getter = await token.getBalance();
      expect(getter).to.equal(500);
    });
    it ("Should not withdraw more than the balance", async function () {
      await expect(token.withdraw(1000)).to.be.revertedWith("Insufficient funds");
    });
  });




});
