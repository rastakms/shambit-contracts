const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const abiDecoder = require("abi-decoder");
use(solidity);

const ShambitContract = artifacts.require("Shambit");
describe("Shambit Tests", function() {
  let ct;

  before(async function() {
    const ContractFactory = await ethers.getContractFactory("Shambit");
    const ShambitTokenContractFactory = await ethers.getContractFactory(
      "ShambitToken"
    );
    SBTct = await ShambitTokenContractFactory.deploy(1000000);
    ct = await ContractFactory.deploy(SBTct.address);
    // ct = await ShambitContract.new();
    // runs once before the first test in this block
  });

  after(function() {
    // runs once after the last test in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });
  describe("ShambitToken test", (accounts) => {
    it("Should  first account send token to second account", async function() {
      const accounts = await ethers.getSigners();
      let acc1 = accounts[1];
      SBTct.transfer(acc1.address, 100);
      expect(await SBTct.balanceOf(acc1.address)).to.equal(100);
    });
    it("Should second account  send token to third account", async function() {
      const accounts = await ethers.getSigners();
      let acc1 = accounts[1];
      let acc2 = accounts[2];
      await SBTct.connect(acc1).transfer(acc2.address, 100);
      expect(await SBTct.balanceOf(acc2.address)).to.equal(100);
    });
  });

  describe("Event test ", (accounts) => {
    it("Should added new public  event without custom target  when gets correct inputs", async function() {
      const accounts = await ethers.getSigners();

      let acc = accounts[0].address;
      let acc1 = accounts[1].address;
      let tNow = 2213;
      SBTct.approve(ct.address, 100);
      await expect(
        ct.addPublicEvent(
          (startDate = tNow),
          (endDate = tNow),
          (location = "35.7016082,51.3366829"),
          (viewRange = 20),
          (capacity = 300),
          (targetsReward = [12, 34, 23]),
          (sharePowerReward = [23, 43, 21]),
          (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
          (tokenName = "SBT")
        )
      )
        .to.emit(ct, "AddPublicEvent")
        .withArgs(acc, 1);
      expect(await SBTct.balanceOf(ct.address)).to.equal(100);
    });
    it("Should get public first event", async function() {
      expect((await ct.getEvent(1)).capacity).to.be.equal(300);
      //  parseInt((await ct.getEvent(1)).capacity._hex)
    });
    it("Should add participant with reffaddres ", async function() {
      const accounts = await ethers.getSigners();
      let acc = accounts[0].address;
      expect(ct.addParticipant(1, acc))
        .to.emit(ct, "AddParticipant")
        .withArgs(1, acc);
    });
    it("Should can set final activity of participant", async function() {
      const accounts = await ethers.getSigners();
      let acc = accounts[0].address;
      expect(ct.setFinalActivityStatus(1, [45, 45, 45]))
        .to.emit(ct, "SetFinalActivityStatus")
        .withArgs(acc, 1);
    });
    it("Should close first event and transfer all reward to participant and send back extra assets to owner of event", async function() {
      expect((await ct.getEventDetail(1)).close).to.be.equal(false);

      expect(ct.closeEvent(1))
        .to.emit(ct, "CloseEvent")
        .withArgs(1);
      expect((await ct.getEventDetail(1)).close).to.be.equal(true);
    });

    it("Should edit first event, just IpfsCID must e change", async function() {
      expect(ct.editEvent(1, "QmaGZnbm9UE5VBWimUEsecLyHB7NzesmT6MmmDzCozKjj7"))
        .to.emit(ct, "EditEvent")
        .withArgs(1);
    });
    it("Should get participant data for first event and specific participant address", async function() {
      const accounts = await ethers.getSigners();
      let acc = accounts[0].address;
      expect((await ct.getParticipantStatus(1, acc)).refAddress).to.be.equal(
        acc
      );
    });
  });
});
