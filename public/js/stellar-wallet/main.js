class Main {
  rootUrl;
  wallets;
  constructor() {
    this.rootUrl = "http://localhost:8080";
    this.wallets = {};
    (async () => {
      window.StellarLayout.showLoading();
      let isOk = false;
      let firstWalletId;
      isOk = await this.#settWallets();
      if (!isOk) {
        return;
      }

      for (const [i, walletId] of Object.keys(this.wallets).entries()) {
        if (i === 0) {
          firstWalletId = walletId;
        }
        const isActive = i === 0;

        await this.#addWalletTab(walletId, isActive);
      }

      await this.renderWallet(firstWalletId);
      window.StellarLayout.hideLoading();
    })();
  }

  async #authGetRequest(url, error) {
    try {
      const resp = await fetch(url, {
        credentials: 'include',
      });
      if (resp.status === 401) {
        window.location.href = "/view/login";
      }

      if (resp.ok) {
        const data = await resp.json();
        return { isOk: true, data };
      }

      throw new Error(`failed to request ${url}`);
    } catch (sysError) {
      console.error(sysError);
      Swal.fire({
        title: error,
        icon: "error",
      });
      return { isOk: false, data: null };
    }
  }

  async #settWallets() {
    const listWalletsUrl = `${this.rootUrl}/stellar/testnet/wallets`;
    const error = "지갑 조회 실패";
    const { isOk, data } = await this.#authGetRequest(listWalletsUrl, error);
    if (!isOk) {
      return false;
    }

    for (const [i, row] of data.entries()) {
      if (row.isActive === 0) {
        continue;
      }

      const walletId = `wallet${i}`;
      this.wallets[walletId] = row;
    }

    return true;
  }

  async #getBalance(walletId) {
    const defaultBalance = "0";
    if (!Object.keys(this.wallets).includes(walletId)) {
      return { isOk: false, balance: defaultBalance };
    }

    const url = `${this.rootUrl}/stellar/testnet/balances?public-key=${this.wallets[walletId].publicKey}`;
    const error = "잔액 조회 실패";
    const { isOk, data } = await this.#authGetRequest(url, error);
    if (!isOk) {
      return { isOk: false, balance: defaultBalance };
    }

    for (const row of data) {
      if (row.assetType === "native") {
        return { isOk: true, balance: row.balance };
      }
    }

    return { isOk: false, balance: defaultBalance };
  }

  async copy(id) {
    const targetElem = document.querySelector(`#${id}`);
    if (!targetElem) {
      Swal.fire({
        title: "복사 실패",
        icon: "error",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(targetElem.textContent);
      Swal.fire({
        title: "복사 성공",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "복사 실패",
        icon: "error",
      });
    }
  }

  async #renderInfo(walletId) {
    const infoId = `${walletId}-info`;
    const infoElem = document.querySelector(`#${infoId}`);

    const { isOk, balance } = await this.#getBalance(walletId);
    const publicKey = this.wallets[walletId].publicKey;

    infoElem.innerHTML = `
      <div class="d-flex flex-column w-100 justify-content-center align-items-center">
        <div class="d-flex w-100 justify-content-end">
          <button type="button" class="btn btn-secondary btn-sm me-3" onclick="StellarLayout.showSetting()">Setting</button>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center pt-4 pb-5">
          <div class="fs-2">${balance} xlm</div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <div class="fs-6 info-public-key">
              <span>publicKey: </span>
              <span id="${walletId}-info-public-key">${publicKey}</span>
            </div>
            <button type="button" class="btn btn-success btn-sm" onclick="StellarMain.copy('${walletId}-info-public-key')">Copy</button>
          </div>
        </div>
      </div>
    `;
  }

  async #getTransactions(walletId) {
    if (!Object.keys(this.wallets).includes(walletId)) {
      return { isOk: false, transactions: [] };
    }
    const url = `${this.rootUrl}/stellar/testnet/transactions?public-key=${this.wallets[walletId].publicKey}`;
    const error = "트랜잭션 목록 조회 실패";
    const { isOk, data } = await this.#authGetRequest(url, error);
    if (!isOk) {
      return { isOk: false, transactions: [] };
    }

    return { isOk: true, transactions: data };
  }

  async #renderTransactions(walletId) {
    const transId = `${walletId}-transactions-content`;
    const transElem = document.querySelector(`#${transId}`);

    const { isOk, transactions } = await this.#getTransactions(walletId);
    const publicKey = this.wallets[walletId].publicKey;

    let html = "";
    for (const [i, trans] of transactions.entries()) {
      const transTypes = trans.operations.map((oper) => oper.type);
      html += `<div class="d-flex flex-column p-2 overflow-hidden">
        <div class="d-flex flex-row justify-content-between">
          <div class="d-flex">
            <span class="fs-3">${trans.successful ? "success" : "failure"}<span>
          </div>
          <div class="d-flex flex-row">
            <span class="fs-5">${transTypes.join(",")} | ${trans.amount}xlm</span>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between align-items-center">
          <div class="transaction-field">
            id: <span id="trans-id-${i}">${trans.id}</span>
          </div>
          <button type="button" class="btn btn-success btn-sm" onclick="StellarMain.copy('trans-id-${i}')">Copy</button>
        </div>
        
        <div class="transaction-field">charged fee: ${trans.feeCharged} Stroop</div>
        <div class="transaction-field">memo: ${trans.memo}</div>
        <div class="transaction-field">created at: ${trans.createdAt}</div>
      </div>`;
    }
    transElem.innerHTML = html;
  }

  async renderWallet(walletId) {
    await this.#renderInfo(walletId);
    await this.#renderTransactions(walletId);
  }

  async #addWalletTab(walletId, isActive) {
    const tabNaviElem = document.querySelector("#pills-tab");
    const tabContentElem = document.querySelector("#pills-tabContent");
    const publicKey = this.wallets[walletId].publicKey;

    const tabNaviHtml = `
    <li class="nav-item" role="presentation">
      <button 
        class="nav-link ${isActive ? "active" : ""}" 
        id="${walletId}-tab" 
        data-bs-toggle="pill" 
        data-bs-target="#${walletId}" 
        type="button" 
        role="tab" 
        aria-controls="${walletId}" 
        aria-selected="false"
        onclick="StellarMain.renderWallet('${walletId}')"
      >
        ${walletId}
      </button>
    </li>`;
    tabNaviElem.insertAdjacentHTML("beforeend", tabNaviHtml);

    const tabContentHtml = `
      <div class="tab-pane fade ${isActive ? "show active" : ""}" id="${walletId}" role="tabpanel" aria-labelledby="${walletId}-tab" tabindex="0">
        <div id="${walletId}-contents" class="d-flex flex-column w-100">
          <div id="${walletId}-info"></div>

          <ul class="nav nav-tabs nav-pills nav-fill" id="${walletId}FuncTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="${walletId}-send-tab" data-bs-toggle="tab" data-bs-target="#${walletId}-send" type="button" role="tab" aria-controls="${walletId}-send" aria-selected="true">Send</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="${walletId}-transactions-tab" data-bs-toggle="tab" data-bs-target="#${walletId}-transactions" type="button" role="tab" aria-controls="${walletId}-transactions" aria-selected="true">Transactions</button>
            </li>
          </ul>
          <div class="tab-content" id="${walletId}FuncTabContents">
            <div class="tab-pane fade show active" id="${walletId}-send" role="tabpanel" aria-labelledby="${walletId}-send-tab">
              <div id="${walletId}-send-content" class="d-flex flex-column w-100 justify-content-center align-items-center">
                <div class="d-flex flex-column w-100 mt-5">
                  <label for="${walletId}-from" class="form-label">From</label>
                  <div class="input-group mb-3">
                    <input type="email" class="form-control" id="${walletId}-from" aria-describedby="basic-addon3" value="${publicKey}" readonly>
                  </div>

                  <label for="${walletId}-to" class="form-label">To</label>
                  <div class="input-group mb-3">
                    <input type="password" class="form-control" id="${walletId}-to" aria-describedby="basic-addon3" placeholder="password">
                  </div>
                  <button type="button" class="btn btn-danger" onClick="StellarLogin.login()">Send</button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="${walletId}-transactions" role="tabpanel" aria-labelledby="${walletId}-transactions-tab">
              <div id="${walletId}-transactions-content"></div>
            </div>
          </div>

        </div>
      </div>
    `;
    tabContentElem.insertAdjacentHTML("beforeend", tabContentHtml);
  }
}

window.StellarMain = new Main();
