const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    const [account] = await ethers.getSigners();
  const { deployer } = await getNamedAccounts()
  const FundMe = await ethers.getContractFactory("FundMe");
  const fundMe = FundMe.attach(account.address);
  console.log(`Got contract FundMe at ${fundMe.address}`)
  console.log("Withdrawing from contract...")
  const transactionResponse = await fundMe.withdraw()
  await transactionResponse.wait()
  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })