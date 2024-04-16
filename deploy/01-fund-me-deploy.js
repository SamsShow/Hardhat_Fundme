const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

// This line exports an asynchronous function as the module's default export. This function takes an object as an argument, which contains the getNamedAccounts and deployments functions.
// The deploy and log functions are extracted from the deployments object.
// The deployer account is extracted from the result of calling the getNamedAccounts function.
// The chainId variable is assigned the value of the current network's chain ID.

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    // const { deployer } = await getNamedAccounts()
    const [account] = await ethers.getSigners()
    const chainId = network.config.chainId

// This block of code checks if the chainId is equal to 31337. If it is, it means the code is running on a local development network.
// If the chainId is 31337, the code retrieves the address of a mock price feed contract called "MockV3Aggregator" using the deployments.get() function and assigns it to the ethUsdPriceFeedAddress variable.
// If the chainId is not 31337, the code retrieves the price feed address from the networkConfig object based on the chainId and assigns it to the ethUsdPriceFeedAddress variable.

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

// These lines log some information and deploy a contract called "FundMe" using the deploy() function.
// The deploy() function takes two arguments: the contract name and an object containing deployment options.
// The from option specifies the deployer's address.
// The args option is an array of arguments to be passed to the contract's constructor. In this case, it contains the ethUsdPriceFeedAddress.
// The log option is set to true, which means the deployment process will be logged.
// The waitConfirmations option specifies the number of block confirmations to wait for before considering the deployment successful. It is set to the value of network.config.blockConfirmations or 1 if it is not defined.
// The deployed contract instance is assigned to the fundMe variable.
// The contract's address is logged.

    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: account.address,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

// This block of code checks if the current network is not included in the developmentChains array and if the ETHERSCAN_API_KEY environment variable is defined.
// If both conditions are met, the verify() function is called to verify the deployed contract on the Ethereum network. The fundMe.address and ethUsdPriceFeedAddress are passed as arguments to the verify() function.

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}


module.exports.tags = ["all", "fundme"]

