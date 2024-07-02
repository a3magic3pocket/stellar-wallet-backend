class Layout {
  showLoading() {
    const loadingElem = document.querySelector("#loading-modal");
    if (loadingElem.classList.contains("hide")) {
      loadingElem.classList.remove("hide");
    }
  }

  hideLoading() {
    const loadingElem = document.querySelector("#loading-modal");
    if (!loadingElem.classList.contains("hide")) {
      loadingElem.classList.add("hide");
    }
  }
}

window.StellarLayout = new Layout();
