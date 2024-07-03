class Layout {
  #showElem(id) {
    const elem = document.querySelector(`#${id}`);
    if (elem.classList.contains("hide")) {
      elem.classList.remove("hide");
    }
  }

  #hideElem(id) {
    const elem = document.querySelector(`#${id}`);
    if (!elem.classList.contains("hide")) {
      elem.classList.add("hide");
    }
  }

  showLoading() {
    this.#showElem("loading-modal");
  }

  hideLoading() {
    this.#hideElem("loading-modal");
  }

  showSetting() {
    this.hideLoading();
    this.#showElem("setting-modal");
  }

  hideSetting() {
    this.hideLoading();
    this.#hideElem("setting-modal");
  }

  async logout() {
    const rootUrl = this.getRootUrl();
    const callbackUrl = `${rootUrl}/view/main`
    window.location.href = `${rootUrl}/auth/logout?callback=${callbackUrl}`;
  }

  getRootUrl() {
    const rootUrlElem = document.querySelector("#var-root-url");
    return rootUrlElem.textContent;
  }
}

window.StellarLayout = new Layout();
