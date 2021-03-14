/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const main = async () => {
  /*
    Getting address of deployed smart contract

    */
  const fromAddress = "0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1";
  const Shambit = await ethers.getContractAt(
    "Shambit",
    fs.readFileSync("./artifacts/Shambit.address").toString()
  );
  const ShambitToken = await ethers.getContractAt(
    "ShambitToken",
    fs.readFileSync("./artifacts/ShambitToken.address").toString()
  );
  const spender = Shambit.address;
  console.log(
    "\n\n 🎫 Approving from " +
      fromAddress +
      "to spender (which is smart contract) " +
      spender +
      "\n"
  );

  eventId = await Shambit.addEvent(
    (startDate = 123456),
    (endDate = 12345678),
    (location = "35.7016082,51.3366829"),
    (viewRange = 20),
    (capacity = 10),
    (targetsReward = [10, 20, 30]),
    (sharePowerReward = [10, 10, 10]),
    (participats = []),
    (IpfsCID = "QmdXUKh8LU75HTVhqjAMyBqQEZ9Cr7cHjBrVzjF3ixeNqZ"),
    (tokenName = "SBT")
  );

  await Shambit.verifyEvent(1);
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
