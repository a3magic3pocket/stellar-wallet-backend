const main = async () => {
  const rootUrl = "http://localhost:8080";

  const listWalletsUrl = `${rootUrl}/stellar/testnet/wallets`;

  try {
    const resp = await fetch(listWalletsUrl);
    if (resp.status === 401) {
      window.location.href = "/view/login";
      console.log("come in here");
    }
  } catch (error) {
    console.error(error);
  }
};

main();
