/* Reference by: https://stackoverflow.com/questions/22582520/bootstrap-horizontal-scrollable-tab-bar, Razib Hossain*/
function updateTabs() {
  //  selector
  document.querySelectorAll(".tab-scroller").forEach((el) => {
    let scrollTabInner = el.querySelector(".nav");
    let scrollTabItem = el.querySelectorAll(".nav-item");
    let leftArrow = el.querySelector(".left-arrow");
    let rightArrow = el.querySelector(".right-arrow");
    //scrollable tab width
    let scrollTabWidth = el.offsetWidth;

    //all tab items width
    let scrollTabItemsWidth = () => {
      let itemsWidth = 0;
      scrollTabItem.forEach((el) => {
        let itemWidth = el.offsetWidth;
        itemsWidth += itemWidth;
      });
      return itemsWidth;
    };

    //hidden tab item width
    let widthOfHiddenItems = scrollTabItemsWidth() - scrollTabWidth;
    let rightValue = 0;
    if (scrollTabItemsWidth() > scrollTabWidth) {
      rightArrow.classList.remove("d-none");
    }

    const handleLeftClick = () => {
      rightValue -= 200;
      scrollTabInner.style.cssText = `right: ${rightValue}px;`;
      rightArrow.classList.remove("d-none");
      if (rightValue <= 0) {
        leftArrow.classList.add("d-none");
        rightArrow.classList.remove("d-none");
        scrollTabInner.style.cssText = `right: 0px;`;
      }
    };

    const handleRightClick = () => {
      if (rightValue > widthOfHiddenItems) {
        rightArrow.classList.add("d-none");
        leftArrow.classList.remove("d-none");
        scrollTabInner.style.cssText = `right: ${widthOfHiddenItems + 35}px;`;
      } else {
        rightArrow.classList.remove("d-none");
        leftArrow.classList.remove("d-none");
        rightValue += 200;
        scrollTabInner.style.cssText = `right: ${rightValue}px;`;
      }
    };

    //right arrow click functionality
    rightArrow.onclick = handleRightClick;

    //left arrow click functionality
    leftArrow.onclick = handleLeftClick;
  });
}
