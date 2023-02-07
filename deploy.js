const fs = require('fs')
const Web3 = require('web3')

require('dotenv').config()


const bytecode = fs.readFileSync('Voter_sol_Voter.bin', 'utf-8')
const abiStr = fs.readFileSync('Voter_sol_Voter.abi', 'utf-8')

const abi = JSON.parse(abiStr)

//Create Wb3
const web3 = new Web3()

web3.setProvider(
    new web3.providers.HttpProvider(
        process.env.INFURA_URL
    )
)

//add priv key

const account = web3.eth.accounts.privateKeyToAccount(
    process.env.ACCOUNT_PRIVATE_KEY
)

web3.eth.accounts.wallet.add(account);


const voterContract = new web3.eth.Contract(abi);


//Deploying smart contracts

console.log('Deploying the contract')

voterContract.deploy({
    data:'0x' + bytecode,
    arguments:[
        ['option1', 'option2'],
    ]
})
.send({
    from: account.address,
    gas:1500000
}).on("transactionHash", function (transactionHash){
    console.log(`Transaction hash : ${transactionHash}`)
})
.on('confirmation', function (confirmationNumber, receipt){
    console.log(`Confirmation Number ${confirmationNumber}`)
    console.log(`Block number${receipt.blockNumber}`)
    console.log(`Block hash${receipt.blockHash}`)
})
.then(function(contractInstance){
    console.log(`Contract address :${contractInstance.options.address}`)
})
.catch(function(error){
    console.log(`Error: ${error}`)
})