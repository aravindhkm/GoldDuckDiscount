const hre = require("hardhat");

async function main() {

  let iterableMappingContract = "";
  let rewardPool = "";
  let goldTokenContract = "";
  let tokenProxyContract  = "";
  let poolProxyContract = "";
  let callDataForToken = "0xc4d66de800000000000000000000000023f60fdbd138235b95f663a4163cb9260098b7d3";
  let callDataForPool = "0xc4d66de80000000000000000000000003787d16f9f2e4adf598355c4ff4800b3500d57fa";


  let poolContract;


  // const mapping = await hre.ethers.getContractFactory("IterableMapping");
  // const IterableMapping = await mapping.deploy();
  // await IterableMapping.deployed();
  // iterableMappingContract = IterableMapping.address;
  // console.log("IterableMapping deployed to:", IterableMapping.address); 
  //  await hre.run("verify:verify", {
  //   address: iterableMappingContract,
  //   constructorArguments: [],
  // });

  // const pool = await hre.ethers.getContractFactory("RewardPool", {
  //   libraries: {
  //     IterableMapping: iterableMappingContract
  //   }});
  // const poolInstance = await pool.deploy();
  // await poolInstance.deployed();
  // rewardPool = poolInstance.address;
  // console.log("poolInstance deployed to:", poolInstance.address); 
  //  await hre.run("verify:verify", {
  //   address: rewardPool,
  //   constructorArguments: [],
  //       libraries: {
  //       IterableMapping: iterableMappingContract
  //     },
  // });

  const gToken = await hre.ethers.getContractFactory("GoldDuckCustomDiscount");
  const goldTOken = await gToken.deploy("0x4bD0DdA9dFAef1235c5B19E87E8206BfA6a5F58d","0xB043360dC22d16bdad3409c58F2cb92161C89245","0x17Ca0928871b2dB9dd3B2f8b27148a436C24Baa8");
  await goldTOken.deployed();
  goldTokenContract = goldTOken.address;
  console.log("goldTokenContract deployed to:", goldTokenContract); 
   await hre.run("verify:verify", {
    address: goldTokenContract,
    constructorArguments: ["0x4bD0DdA9dFAef1235c5B19E87E8206BfA6a5F58d","0xB043360dC22d16bdad3409c58F2cb92161C89245","0x17Ca0928871b2dB9dd3B2f8b27148a436C24Baa8"],
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
