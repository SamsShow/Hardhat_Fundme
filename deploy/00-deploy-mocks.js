const { network } = require("hardhat")
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    // const { deployer } = await getNamedAccounts()
    const [account] = await ethers.getSigners()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!


    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: account.address,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        )
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!"
        )
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]

// The script starts by importing the network object from the hardhat module. This object allows us to access information about the current network configuration.

// Two constants, DECIMALS and INITIAL_PRICE, are defined. These constants seem to be related to the deployment of a mock contract.

// The script exports an asynchronous function that takes an object with two properties, getNamedAccounts and deployments, as its parameter. This function is the main entry point for the deployment script.

// Inside the function, the deploy and log functions are extracted from the deployments object.

// The getNamedAccounts function is called to retrieve the deployer account.

// The chainId variable is assigned the value of the current network's chain ID.

// The script checks if the chainId is equal to 31337, which is typically used for local development networks.

// If the condition is true, it means that the script is running on a local development network. The script proceeds to deploy a mock contract called "MockV3Aggregator" using the deploy function.

// The deploy function is called with the contract name, deployment options, and constructor arguments. The log function is used to display informative messages during the deployment process.

// After the deployment, additional log messages are displayed to indicate that the mocks have been deployed and provide instructions for interacting with the deployed smart contracts.

// Finally, the module.exports.tags property is set to an array containing the tags "all" and "mocks". This allows the deployment script to be filtered based on these tags when running specific deployment tasks.