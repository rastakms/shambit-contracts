const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const abiDecoder = require("abi-decoder");
use(solidity);

// describe("My Dapp", function () {
//   let myContract;

//   describe("YourContract", function () {
//     it("Should deploy YourContract", async function () {
//       const YourContract = await ethers.getContractFactory("Shambit");

//       myContract = await YourContract.deploy();
//     });

//     describe("setPurpose()", function () {
//       it("Should be able to set a new purpose", async function () {
//         const newPurpose = "Test Purpose";

//         await myContract.setPurpose(newPurpose);
//         expect(await myContract.purpose()).to.equal('newPurpose');
//       });
//     });
//     describe("setPurpose()", function () {
//       it("Should be able to set a new purpose", async function () {
//         const newPurpose = "Test Purposewww";

//         await myContract.setPurpose(newPurpose);
//         expect(await myContract.purpose()).to.equal(newPurpose);
//       });
//     });
//   });
// });

const ShambitContract = artifacts.require("Shambit");
describe("Shambit Tests", function() {
  let ct;

  before(async function() {
    const ContractFactory = await ethers.getContractFactory("Shambit");
    ct = await ContractFactory.deploy();

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

  describe("Event test ", (accounts) => {
    it("Should added new public  event without custom target  when gets correct inputs", async function() {
      const accounts = await ethers.getSigners();
      let acc = accounts[0].address;
      let tNow = 2213;
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
    // let event = {
    //   label: "global",
    //   id: 0,
    //   startDate: 1,
    //   endDate: 2,
    //   hStart: 3,
    //   mStart: 12,
    //   hEnd: 3,
    //   mEnd: 4,
    //   accessibilityType: 1,
    //   location: { lat: 343, long: 343 },
    //   viewRange: 10,
    //   capacity: 200,
    //   targetsReward: [10, 20, 30],
    //   sharePowerReward: [5, 20, 16],
    //   participantsId: [],
    //   participantsSize: 0,
    //   veified: false,
    //   IpfsCID: "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ",
    //   tokenName: "SBT",
    //   tokenDeposit: 0,
    // };

    // const accounts = await ethers.getSigners();
    // let acc = accounts[0].address;
    // await expect(ct.addEvent(event))
    //   .to.emit(ct, "AddEvent")
    //   .withArgs(acc,1);

    //   console.log(await  ct.getEvent(1));
    // console.log("new EventId:", eventId);
    // let event = await ct.getEvent(eventId);
    // assert.equal(await ct.getEvent(eventId), "🛠 Programming hi amir");

    // describe("Shambit subtest1", (accounts) => {  q
    //   it("Should return the new greeting once it's changed", async function () {
    //     assert.equal(await greeter.purpose(), "Hola, mundo!1");
    //   });
    // });

    // it("Should return the new greeting once it's changed", async function () {
    //   //const greeter = await YourContract.new();
    //   assert.equal(await greeter.purpose(), "Hola, mundo!");

    //   await greeter.setPurpose("Hola, mundo!");

    //   assert.equal(await greeter.purpose(), "Hola, mundo!");
    // });
  });
});
