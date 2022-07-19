// function deployFunc() {
//     console.log("Hi")
// }

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     //equivalent of hre.getNamesAccounts
//     const { getNamedAccounts, deployments } = hre
// }

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"]
    }
    // if the contract does not exist, we deploy a minimum version for our local testing
    const args = [ethUsdPriceFeedAddress]
    console.log(args)
    // when testing locally use a mock.
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // price feed address here
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //verify
        await verify(fundMe.address, args)
    }
    log("----------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
