// const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const abiDecoder = require("abi-decoder");
use(solidity);

const ShambitContract = artifacts.require("Shambit");
describe("Shambit Tests : addParticipant function  tests", function() {
  let ct;

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
    const accounts = await ethers.getSigners();

    let acc = accounts[0].address;
    let acc1 = accounts[1].address;
    await SBTct.approve(ct.address, 200000);
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  it("should not add participant  for private event (revert expected)", async () => {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
    await expect(
      ct.addEvent(
        (startDate = 100000),
        (endDate = 300000 + 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 30),
        (targetsReward = [100, 200, 300]),
        (sharePowerReward = [10, 10, 10]),
        (participats = [
          accounts[3].address,
          accounts[4].address,
          accounts[5].address,
          accounts[6].address,
          accounts[7].address,
          accounts[8].address,
          accounts[9].address,
        ]),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    )
      .to.emit(ct, "AddEvent")
      .withArgs(acc, 1);

    await expect(ct.addParticipant(1)).to.be.reverted;
  });
  it("should  add participant  for public event  after verification ", async () => {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
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

  it("should  add participant  for public event  after verification with referral address  ", async () => {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
    let acc1 = accounts[1].address;
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
    await expect(ct.connect(accounts[1]).addParticipantWithRefAddress(1, acc))
      .to.emit(ct, "AddParticipant")
      .withArgs(1, acc1);
  });
  it("should  not add participant  for public event  after verification with referral address  bec referral person doesnt participate before ", async () => {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
    let acc1 = accounts[1].address;
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
    await expect(ct.connect(accounts[1]).addParticipantWithRefAddress(1, accounts[2].address))
      .to.be.reverted
  });

  it("should not  add participant  for public event  after verification bec it already added (revert expected)", async () => {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
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

    await expect(ct.addParticipant(1)).to.be.reverted;
  });
});
