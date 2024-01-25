const main = async () => {
  const Cpher = await hre.ethers.getContractFactory("Cpher");
  const cpher = await Cpher.deploy();

  await cpher.deployed();

  console.log("Cpher deployed to:", cpher.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
