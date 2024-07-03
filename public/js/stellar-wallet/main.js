class Main {
  rootUrl;
  wallets;
  balanceMap;
  lastRecordPagingToken;
  isInRenderingTransactions;
  constructor() {
    this.rootUrl = StellarLayout.getRootUrl();
    this.wallets = {};
    this.balanceMap = {};
    this.lastRecordPagingToken = null;
    this.isInRenderingTransactions = false;
    (async () => {
      window.StellarLayout.showLoading();
      let isOk = false;
      let firstWalletId;
      isOk = await this.#settWallets();
      if (!isOk) {
        return;
      }

      // 지갑이 하나도 없을때 지갑 생성
      if (Object.keys(this.wallets).length === 0) {
        await this.createNewWallet();
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

  async #authRequest(url, error, method = "GET", formData = {}, headers = {}) {
    try {
      const option = {
        method,
        credentials: "include",
      };
      if (Object.keys(formData).length > 0) {
        option["body"] = JSON.stringify(formData);
      }
      if (Object.keys(headers).length > 0) {
        option["headers"] = headers;
      }

      const resp = await fetch(url, option);
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
    const { isOk, data } = await this.#authRequest(listWalletsUrl, error);
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
    const { isOk, data } = await this.#authRequest(url, error);
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
      console.error(`#${id} element not exists`);
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
      console.error("error", error);
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
    this.balanceMap[walletId] = balance;
    const publicKey = this.wallets[walletId].publicKey;

    infoElem.innerHTML = `
      <div class="d-flex flex-column w-100 justify-content-center align-items-center">
        <div class="d-flex w-100 justify-content-end mt-1">
          <button type="button" class="btn btn-warning btn-sm me-3" onclick="StellarMain.createNewWallet()">New</button>
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

  async #getTransactions(walletId, pagingToken = null) {
    if (!Object.keys(this.wallets).includes(walletId)) {
      return { isOk: false, transactions: [] };
    }
    let url = `${this.rootUrl}/stellar/testnet/transactions?public-key=${this.wallets[walletId].publicKey}`;
    if (pagingToken !== null) {
      url += `&cursor=${pagingToken}`;
    }
    const error = "트랜잭션 목록 조회 실패";
    const { isOk, data } = await this.#authRequest(url, error);
    if (!isOk) {
      return { isOk: false, transactions: [] };
    }

    return { isOk: true, transactions: data };
  }

  async #renderTransactions(walletId, pagingToken = null) {
    this.isInRenderingTransactions = true;
    const transId = `${walletId}-transactions-content`;
    const transElem = document.querySelector(`#${transId}`);

    const { isOk, transactions } = await this.#getTransactions(
      walletId,
      pagingToken
    );
    const publicKey = this.wallets[walletId].publicKey;

    if (this.lastRecordPagingToken === null) {
      transElem.innerHTML = "";
    }

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
    if (transactions.length > 0) {
      transElem.innerHTML = transElem.innerHTML + html;
    }

    // 마지막 pagingToken 저장
    const lastTrans = transactions[transactions.length - 1];
    if (lastTrans && lastTrans.pagingToken) {
      this.lastRecordPagingToken = lastTrans.pagingToken;
    } else {
      this.lastRecordPagingToken = null;
    }

    // transactionLoading 숨기기
    this.#hideTransactionLoading(walletId);

    this.isInRenderingTransactions = false;
  }

  async #setTransactionsObserver(walletId) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.length <= 0) {
        return;
      }

      const entry = entries[0];
      const walletId = entry.target.id.split("-")[0];
      if (!walletId) {
        return;
      }

      if (this.lastRecordPagingToken === null) {
        return;
      }

      // transLoading 나타내기
      this.#showTransactionLoading(walletId);

      if (!this.isInRenderingTransactions) {
        this.#renderTransactions(walletId, this.lastRecordPagingToken);
      }
    });
    observer.observe(
      document.querySelector(`#${walletId}-transactions-anchor`)
    );
  }

  #hideTransactionLoading(walletId) {
    const transLoadingElem = document.querySelector(
      `#${walletId}-transactions-loading`
    );
    if (transLoadingElem.classList.contains("d-flex")) {
      transLoadingElem.classList.remove("d-flex");
      transLoadingElem.classList.add("d-none");
    }
  }

  #showTransactionLoading(walletId) {
    const transLoadingElem = document.querySelector(
      `#${walletId}-transactions-loading`
    );
    if (transLoadingElem.classList.contains("d-none")) {
      transLoadingElem.classList.remove("d-none");
      transLoadingElem.classList.add("d-flex");
    }
  }

  #initTransactionElem(walletId) {
    const transId = `${walletId}-transactions-content`;
    const transElem = document.querySelector(`#${transId}`);
    transElem.innerHTML = "";
  }

  async renderWallet(walletId) {
    this.lastRecordPagingToken = null;
    this.#initTransactionElem(walletId);
    this.#showTransactionLoading(walletId);

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
                <div class="d-flex flex-column w-100 mt-3">
                  <label for="${walletId}-from" class="form-label"><span class="text-danger">*</span> From</label>
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="${walletId}-from" aria-describedby="basic-addon3" value="${publicKey}" readonly>
                  </div>

                  <label for="${walletId}-to" class="form-label"><span class="text-danger">*</span> To</label>
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="${walletId}-to" aria-describedby="basic-addon3" placeholder="to">
                  </div>

                  <label for="${walletId}-amount" class="form-label"><span class="text-danger">*</span> Amount</label>
                  <div class="input-group mb-3">
                    <input type="number" class="form-control" id="${walletId}-amount" aria-describedby="basic-addon3" placeholder="amount">
                  </div>

                  <label for="${walletId}-memo" class="form-label">Memo</label>
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="${walletId}-memo" aria-describedby="basic-addon3" placeholder="memo">
                  </div>

                  <button type="button" class="btn btn-danger" onClick="StellarMain.send('${walletId}')">Send</button>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="${walletId}-transactions" role="tabpanel" aria-labelledby="${walletId}-transactions-tab">
              <div id="${walletId}-transactions-content"></div>
              <div id="${walletId}-transactions-anchor"></div>
              <div id="${walletId}-transactions-loading" class="d-none justify-content-center p-2">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
    tabContentElem.insertAdjacentHTML("beforeend", tabContentHtml);

    // 상단 wallet 탭 관련 기능 갱신
    updateTabs();

    // 스크롤 로딩을 위한 transactionObserver 설정
    this.#setTransactionsObserver(walletId);
  }

  async createNewWallet() {
    window.StellarLayout.showLoading();
    const url = `${this.rootUrl}/stellar/testnet/wallet`;
    const error = "지갑 생성 실패";
    const { isOk, data } = await this.#authRequest(url, error, "POST");
    if (isOk) {
      Swal.fire({
        title: "지갑 생성 성공",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
      return;
    }
    window.StellarLayout.hideLoading();
  }

  async send(walletId) {
    const from = document.querySelector(`#${walletId}-from`).value;
    const to = document.querySelector(`#${walletId}-to`).value;
    const amount = document.querySelector(`#${walletId}-amount`).value;
    const memo = document.querySelector(`#${walletId}-memo`).value;
    if (!to) {
      Swal.fire({
        title: "수령 지갑 공개키(To)를 입력해주세요",
        icon: "error",
      });
      return;
    }
    if (!amount) {
      Swal.fire({
        title: "전송량(Amount)를 입력해주세요",
        icon: "error",
      });
      return;
    }
    if (parseFloat(amount) > this.balanceMap[walletId]) {
      Swal.fire({
        title: "전송량(Amount)은 보유 수량보다 작아야 합니다",
        icon: "error",
      });
      return;
    }

    window.StellarLayout.showLoading();

    const url = `${this.rootUrl}/stellar/testnet/send`;
    const error = "송금 실패";
    const formData = {
      "departure-public-key": from,
      "destination-public-key": to,
      memo: memo ? memo : "",
      amount,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const { isOk, data } = await this.#authRequest(
      url,
      error,
      "POST",
      formData,
      headers
    );
    if (isOk) {
      Swal.fire({
        title: "송금 성공",
        icon: "success",
      }).then(() => {
        window.StellarLayout.hideLoading();
      });
      return;
    }

    window.StellarLayout.hideLoading();
  }
}

window.StellarMain = new Main();
