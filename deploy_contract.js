const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");
const hmy = new Harmony(process.env.URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const privateKey = process.env.PRIVATE_KEY;

const contractJson = require("./Test.json");

const options1 = { gasPrice: "0x3B9ACA00" }; // gas price in hex corresponds to 1 Gwei or 1000000000
let options2 = { gasPrice: 1000000000, gasLimit: 21000 }; // setting the default gas limit, but changing later based on estimate gas
const options3 = { data: contractJson.bytecode }; // contractConstructor needs contract bytecode to deploy

(async function () {
  const factory = hmy.contracts.createContract(contractJson.abi);
  factory.wallet.addByPrivateKey(privateKey);
  const gas = await factory.methods
    .contractConstructor(options3)
    .estimateGas(options1);
  options2 = { ...options2, gasLimit: hexToNumber(gas) };

  const contract = await factory.deploy(options3).send(options2);
  console.log("Contract deployed at: ", contract.address);
})();
