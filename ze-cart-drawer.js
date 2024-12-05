// Menu drawer js
function zeMenuDrawer() {
  const menuBtn = document.querySelector('.ze-menu-btn');
  const menuClose = document.querySelector('.ze-menu-close');
  const menuDrawer = document.querySelector('.ze-menu-drawer');

  menuBtn.addEventListener('click', () => {
    menuDrawer.classList.toggle('open');
  });
  menuClose.addEventListener('click', () => {
    menuDrawer.classList.remove('open');
  });

  document.addEventListener('click', (event) => {
    if (!menuDrawer.contains(event.target) && !menuBtn.contains(event.target)) {
      menuDrawer.classList.remove('open');
    }
  });
}
zeMenuDrawer();

function zeMenuProductSlider() {
  $('.ze-header-collection-col-slider').slick({
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    centerPadding: "10px",
    centerMode: true,
  });
}
zeMenuProductSlider();

// Cart drawer all js 
function openCartDrawer() {
  document.querySelector(".ze-cart-drawer").classList.add("ze-cart-drawer--active");
}

function closeCartDrawer() {
  document
    .querySelector(".ze-cart-drawer")
    .classList.remove("ze-cart-drawer--active");
}

function updateCartItemCounts(count) {
  document.querySelectorAll(".ze-cart-count").forEach((el) => {
    el.textContent = count;
  });
}

async function updateCartDrawer() {
  const res = await fetch("/?section_id=ze-cart-drawer");
  const text = await res.text();
  const html = document.createElement("div");
  html.innerHTML = text;

  const newBox = html.querySelector(".ze-cart-drawer").innerHTML;

  document.querySelector(".ze-cart-drawer").innerHTML = newBox;

  addCartDrawerListeners();
}

function addCartDrawerListeners() {
  // Update quantities
  document
    .querySelectorAll(".ze-cart-drawer-quantity-selector button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        // Get line item key
        const rootItem =
          button.parentElement.parentElement.parentElement.parentElement
            .parentElement;
        const key = rootItem.getAttribute("data-line-item-key");

        // Get new quantity
        const currentQuantity = Number(
          button.parentElement.querySelector("input").value
        );
        const isUp = button.classList.contains(
          "ze-cart-drawer-quantity-selector-plus"
        );
        const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

        // Ajax update
        const res = await fetch("/cart/update.js", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: { [key]: newQuantity } }),
        });
        const cart = await res.json();

        updateCartItemCounts(cart.item_count);

        // Update cart
        updateCartDrawer();
      });
    });

  document.querySelector(".ze-cart-drawer-box").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document
    .querySelectorAll(".ze-cart-drawer-header-right-close, .ze-cart-drawer")
    .forEach((el) => {
      el.addEventListener("click", () => {
        console.log("closing drawer");
        closeCartDrawer();
      });
    });
}

addCartDrawerListeners();

document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Submit form with ajax
    await fetch("/cart/add", {
      method: "post",
      body: new FormData(form),
    });

    // Get cart count
    const res = await fetch("/cart.js");
    const cart = await res.json();
    updateCartItemCounts(cart.item_count);

    // Update cart
    await updateCartDrawer();

    // Open cart drawer
    openCartDrawer();
  });
});

document.querySelectorAll('a[href="/cart"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openCartDrawer();
  });
});
