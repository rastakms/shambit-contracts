// const { ethers } = require("hardhat");
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
  context("test Context", () => {
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
        const expectedCost = 198000;
        await SBTct.approve(ct.address, 198000);
        await expect(
          ct.addEvent(
            (startDate = tNow),
            (endDate = tNow + 1),
            (location = "35.7016082,51.3366829"),
            (viewRange = 20),
            (capacity = 300),
            (targetsReward = [100, 200, 300]),
            (sharePowerReward = [10, 10, 10]),
            (participats = [
              // accounts[3].address,
              // accounts[4].address,
              // accounts[5].address,
              // accounts[6].address,
              // accounts[7].address,
              // accounts[8].address,
              // accounts[9].address,
            ]),
            (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
            (tokenName = "SBT")
          )
        )
          .to.emit(ct, "AddEvent")
          .withArgs(acc, 1);
        expect(await SBTct.balanceOf(ct.address)).to.equal(198000);
      });
      it("Should get public first event", async function() {
        expect((await ct.getEvent(1)).capacity).to.be.equal(300);
        //  parseInt((await ct.getEvent(1)).capacity._hex)
      });

      it("Should verify event", async function() {
        await ct.verifyEvent(1);
        expect((await ct.getEventDetail(1)).verified).to.be.equal(true);
        //  parseInt((await ct.getEvent(1)).capacity._hex)
      });

      it("Should edit first event, just IpfsCID must e change", async function() {
        await expect(
          ct.editEvent(1, "QmaGZnbm9UE5VBWimUEsecLyHB7NzesmT6MmmDzCozKjj7")
        )
          .to.emit(ct, "EditEvent")
          .withArgs(1);
      });

      it("Should add participant without reffaddres ", async function() {
        const accounts = await ethers.getSigners();
        let acc = accounts[0];
        let accAddress = acc.address;

        let refAddress = accounts[2].address;

        await expect(ct.addParticipant(1))
          .to.emit(ct, "AddParticipant")
          .withArgs(1, accAddress);

        // await expect(ct.connect(acc).addParticipant(1, refAddress))
        //   .to.emit(ct, "AddParticipant")
        //   .withArgs(1, accAddress);
      });
      it("Should set final activity of participant", async function() {
        const accounts = await ethers.getSigners();
        let acc = accounts[0];
        let accAddress = acc.address;
        await expect(ct.connect(acc).setFinalActivityStatus(1, [50, 50, 50]))
          .to.emit(ct, "SetFinalActivityStatus")
          .withArgs(accAddress, 1);
      });

      it("Should close first event", async function() {
        expect((await ct.getEventDetail(1)).close).to.be.equal(false);

        await expect(ct.closeEvent(1))
          .to.emit(ct, "CloseEvent")
          .withArgs(1);
        expect((await ct.getEventDetail(1)).close).to.be.equal(true);
      });

      it("Should get participant data for first event and specific participant address", async function() {
        const accounts = await ethers.getSigners();
        let acc = accounts[0];
        let accAddress = acc.address;
        let refAddress = accounts[2].address;
        const participatData = await ct.getParticipantStatus(1, accAddress);
        // const refDataData = await ct.getParticipantStatus(1, refAddress);
        // expect(participatData.refAddress).to.be.equal(refAddress);
      });

      it("User should withdraw his rewards", async function() {
        const accounts = await ethers.getSigners();
        let acc = accounts[0];
        let accAddress = acc.address;
        await ct.connect(acc).withdrawReward(1);
        const participatData = await ct.getParticipantStatus(1, accAddress);
        // console.log("user's reward", participatData.reward.toString());
        // await ct.connect(ref).withdrawReward(1);
        const participatTokens = await SBTct.balanceOf(accAddress);
        // console.log("user's token balance", participatTokens.toString());
      });
    });
  });
});
