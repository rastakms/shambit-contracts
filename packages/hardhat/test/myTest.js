const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

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
describe("Shambit Tests", function () {
  let ct;
  before(async function () {
    ct = await ShambitContract.new();
    // runs once before the first test in this block
  });

  after(function () {
    // runs once after the last test in this block
  });

  beforeEach(function () {
    console.log("inja");
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });

  describe("Events test adding, closing, editing", (accounts) => {
    it("Should added new public  event without custom target  when gets correct inputs", async function () {
      let event = {
        lable: "global walking event ",
        startDate: "first of jun 2021",
        endData: "last of june 2021",
        startTime: 00,
        endTIme: 12,
        accessibilityType: "public",
        location: "Torento",
        viewRange: 10,
        capacity: 200,
        targetReward: [10, 20, 30],
        sharePowerReward: [5, 20, 16],
        IpfCID: "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ",
        tokenName: "SBT",
      };
      console.log("Address of sender : ",ethers.getJsonWalletAddress())
      //   await expect(ct.addEvent(
      //   (startDate = Date.now()),
      //   (endDate = Date.now()),
      //   (hStart = 3),
      //   (mStart = 4),
      //   (hEnd = 6),
      //   (mEnd = 4),
      //   (latLocation = 1222),
      //   (longLocation = 555)
      // )).to.emit(ct,'AddEvent')
      // .withArgs();
      // console.log("new EventId:", eventId);
      // let event = await ct.getEvent(eventId);
      // assert.equal(await ct.getEvent(eventId), "🛠 Programming hi amir");

      // describe("Shambit subtest1", (accounts) => {
      //   it("Should return the new greeting once it's changed", async function () {
      //     assert.equal(await greeter.purpose(), "Hola, mundo!1");
      //   });
      // });
    });
    // it("Should return the new greeting once it's changed", async function () {
    //   //const greeter = await YourContract.new();
    //   assert.equal(await greeter.purpose(), "Hola, mundo!");

    //   await greeter.setPurpose("Hola, mundo!");

    //   assert.equal(await greeter.purpose(), "Hola, mundo!");
    // });
  });
});
