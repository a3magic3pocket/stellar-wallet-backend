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
    window.location.href = "http://localhost:8080/auth/logout";
  }
}

window.StellarLayout = new Layout();
