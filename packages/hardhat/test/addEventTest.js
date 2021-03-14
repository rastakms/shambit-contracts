// const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const abiDecoder = require("abi-decoder");
use(solidity);

const ShambitContract = artifacts.require("Shambit");
describe("Shambit Tests : addEvent function  tests", function() {
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

  it("Should add new public  event without custom target  when gets correct inputs", async function() {
    const accounts = await ethers.getSigners();
    let acc = accounts[0].address;
    await expect(
      ct.addEvent(
        (startDate = 1000),
        (endDate = 1000 + 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 30),
        (targetsReward = [10, 20, 30]),
        (sharePowerReward = [10, 10, 10]),
        (participats = []),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    )
      .to.emit(ct, "AddEvent")
      .withArgs(acc, 1);
    expect(await SBTct.balanceOf(ct.address)).to.equal(1980);
    expect((await ct.getEvent(1)).capacity).to.be.equal(30);
    expect((await ct.getEvent(1)).isPublic).to.be.equal(true);
  });

  it("Should added new  private  event  when gets correct inputs", async function() {
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
    expect(await SBTct.balanceOf(ct.address)).to.equal(19800);
    expect((await ct.getEvent(1)).capacity).to.be.equal(30);
    expect((await ct.getEvent(1)).isPublic).to.be.equal(false);

  });
  it("Should  not add new   event bec capacity and partcicipant are empty (revert expected)", async function() {
    const accounts = await ethers.getSigners();

    let acc = accounts[0].address;
    await expect(
      ct.addEvent(
        (startDate = 100000),
        (endDate = 300000 + 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 0),
        (targetsReward = [100, 200, 300]),
        (sharePowerReward = [10, 10, 10]),
        (participats = []),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    ).to.be.reverted;
  });

  it("Should  not add new   event bec start and end time is not correct (revert expected)", async function() {
    const accounts = await ethers.getSigners();

    let acc = accounts[0].address;
    await expect(
      ct.addEvent(
        (startDate = Date.now()),
        (endDate = Date.now() - 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 20),
        (targetsReward = [100, 200, 300]),
        (sharePowerReward = [10, 10, 10]),
        (participats = []),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    ).to.be.reverted;
  });

  it("Should  not add new   event bec   shareReward has not correct number(revert expected)", async function() {
    const accounts = await ethers.getSigners();

    let acc = accounts[0].address;
    await expect(
      ct.addEvent(
        (startDate = Date.now()),
        (endDate = Date.now() + 1),
        (location = "35.7016082,51.3366829"),
        (viewRange = 20),
        (capacity = 20),
        (targetsReward = [120]),
        (sharePowerReward = [120]),
        (participats = []),
        (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
        (tokenName = "SBT")
      )
    ).to.be.reverted;
  });
});
