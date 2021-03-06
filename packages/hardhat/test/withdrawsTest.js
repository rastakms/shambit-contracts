// const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const abiDecoder = require("abi-decoder");
use(solidity);

const ShambitContract = artifacts.require("Shambit");
describe("Shambit Tests : withraw functions  tests", function() {
  let ct;
  let acc;
  let acc1;
  let accounts;
  before(async function() {
    // ct = await ShambitContract.new();
    // runs once before the first test in this block
  });

  after(function() {
    // runs once after the last test in this block
  });

  beforeEach(async function() {
    const ContractFactory = await ethers.getContractFactory("Shambit");
    const ShambitTokenContractFactory = await ethers.getContractFactory(
      "ShambitToken"
    );
    SBTct = await ShambitTokenContractFactory.deploy(1000000);
    ct = await ContractFactory.deploy(SBTct.address);
    accounts = await ethers.getSigners();

    acc = accounts[0].address;
    acc1 = accounts[1].address;
    await SBTct.approve(ct.address, 200000);

    await expect(
      ct.addEvent(
        (startDate = 100000),
        (endDate = 300000 + 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 30),
        (targetsReward = [100, 200, 300]),
        (sharePowerReward = [10, 10, 10]),
        (participats = []),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    )
      .to.emit(ct, "AddEvent")
      .withArgs(acc, 1);

    await ct.verifyEvent(1);
    expect((await ct.getEventDetail(1)).verified).to.be.equal(true);
    await expect(ct.addParticipant(1))
      .to.emit(ct, "AddParticipant")
      .withArgs(1, acc);
  });

  // runs before each test in this block

  afterEach(function() {
    // runs after each test in this block
  });

  it("Should not get reward bec acc1 didnt participate before ( reverte expected)", async () => {
    // console.log( ct.getParticipantStatus(1, acc).complete)
    // await expect(await ct.getParticipantStatus(1, acc).reward).to.equal(0);
    await ct.closeEvent(1);
    await expect(ct.connect(accounts[1]).withdrawReward(1)).to.be.reverted;
  });

  it("Should not get reward bec event has not finished ( reverte expected)", async () => {
    expect( ct.withdrawReward(1)).to.be.reverted;
  });

  it("Should   get reward", async () => {
    await expect(ct.connect(accounts[1]).addParticipantWithRefAddress(1, acc))
      .to.emit(ct, "AddParticipant")
      .withArgs(1, acc1);
    expect(
      (await ct.connect(accounts[1]).getParticipantStatus(1, acc1)).complete
    ).to.equal(false);

    await expect(
      ct.connect(accounts[1]).setFinalActivityStatus(1, [50, 50, 50])
    )
      .to.emit(ct, "SetFinalActivityStatus")
      .withArgs(acc1, 1);
    expect(
      (await ct.connect(accounts[1]).getParticipantStatus(1, acc1)).complete
    ).to.equal(true);
    expect((await ct.getParticipantStatus(1, acc)).reward).to.equal(30);

    await ct.closeEvent(1);
    await ct.connect(accounts[1]).withdrawReward(1);
    expect((await ct.getParticipantStatus(1, acc)).reward).to.equal(30);
    expect(await SBTct.balanceOf(acc1)).to.be.equal(300);
  });

  it("Should get RemainingDeposit", async () => {
    // console.log( ct.getParticipantStatus(1, acc).complete)
    // await expect(await ct.getParticipantStatus(1, acc).reward).to.equal(0);
    await expect(ct.connect(accounts[1]).addParticipantWithRefAddress(1, acc))
      .to.emit(ct, "AddParticipant")
      .withArgs(1, acc1);
    expect(
      (await ct.connect(accounts[1]).getParticipantStatus(1, acc1)).complete
    ).to.equal(false);

    await expect(
      ct.connect(accounts[1]).setFinalActivityStatus(1, [50, 50, 50])
    )
      .to.emit(ct, "SetFinalActivityStatus")
      .withArgs(acc1, 1);
    expect(
      (await ct.connect(accounts[1]).getParticipantStatus(1, acc1)).complete
    ).to.equal(true);
    expect((await ct.getParticipantStatus(1, acc)).reward).to.equal(30);

    await ct.closeEvent(1);
    await ct.connect(accounts[1]).withdrawReward(1);
    expect((await ct.getParticipantStatus(1, acc)).reward).to.equal(30);
    expect(await SBTct.balanceOf(acc1)).to.be.equal(300);
    expect(await SBTct.balanceOf(acc)).to.be.equal(980200);
    await ct.withdrawRemainingDeposit(1);
    expect(await SBTct.balanceOf(acc)).to.be.equal(999670);
  });
});
