const hre = require("hardhat");

async function main() {

  let goldTokenContract = "0x0e170DFc30B4205235Cecd107c48a74B1A0AF0be";

  // const gToken = await hre.ethers.getContractFactory("GolduckCustomDiscount");
  // const goldTOken = await gToken.deploy();
  // await goldTOken.deployed();
  // goldTokenContract = goldTOken.address;
  // console.log("goldTokenContract deployed to:", goldTokenContract); 


  await hre.run("verify:verify", {
    address: goldTokenContract,
    constructorArguments: [],
  });



  // tokenproxy


  // const tProxy = await hre.ethers.getContractFactory("TokenProxy");
  // const tokenProxy = await tProxy.deploy(goldTokenContract,"0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd",callDataForToken);
  // await tokenProxy.deployed();
  // tokenProxyContract = tokenProxy.address;
  // console.log("IterableMapping deployed to:", tokenProxyContract); 
  //  await hre.run("verify:verify", {
  //   address: "0xD4C3f4D589AF6877D54d620e351108C82E465fD9",
  //   constructorArguments: [goldTokenContract,"0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd",callDataForToken],
  // });

  // pool Proxy

  // const pProxy = await hre.ethers.getContractFactory("RewardPoolProxy");
  // const poolProxy = await pProxy.deploy(rewardPool,"0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd",callDataForPool);
  // await poolProxy.deployed();
  // poolProxyContract = poolProxy.address;
  // console.log("IterableMapping deployed to:", poolProxyContract); 
  //  await hre.run("verify:verify", {
  //   address: poolProxyContract,
  //   constructorArguments: [rewardPool,"0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd",callDataForPool],
  // });


  // reward pool

  //  await hre.run("verify:verify", {
  //   address: "0x0AA6ec112Ea7CEd3A920833Cae66f5A7424eFabF",
  //   constructorArguments: [],
  // });

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
