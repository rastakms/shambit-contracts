/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const main = async () => {
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

  await ShambitToken.approve(spender, 10000);
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
