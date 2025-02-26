"use strict";

const dessertsContainer = document.querySelector(".desserts__container");
const cartContainer = document.querySelector(".cart__items");
const cartCount = document.querySelector(".cart__count");
const cartTotalPrice = document.querySelector(".cart__total-price");
const cartSelected = document.querySelector(".cart__selected");
const cartEmpty = document.querySelector(".cart__empty");
let cartItems = [];
let dessertsData = [];

fetch("data.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }
    return res.json();
  })
  .then((data) => {
    dessertsData = data;
    addItems(data);
  })
  .catch((err) => {
    dessertsContainer.innerHTML = `Error fetching data: ${err.message}`;
  });

function addItems(data) {
  let html = "";

  data.forEach((item, index) => {
    html += `
    <div class="desserts__item">
      <div class="desserts__content">
        <picture class="desserts__picture">
          <source media="(min-width: 77.5rem)" srcset="${item.image.desktop}" />
          <source media="(min-width: 43.125rem)" srcset="${
            item.image.tablet
          }" />
          <img
            class="desserts__image"
            src="${item.image.mobile}"
            alt="${item.name}"
            data-index="${index}" 
          />
        </picture>
    
        <div class="desserts__actions">
          <button class="desserts__cart-btn">
            <img src="assets/images/icon-add-to-cart.svg" alt="" />
            Add to Cart
          </button>
    
          <div class="desserts__quantity" style="display: none;">
            <button class="desserts__qty-decrement qty-crement">
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="2"
                fill="none"
                viewBox="0 0 10 2"
              >
                <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
              </svg>
            </button>
            <span class="desserts__qty-value" data-index="${index}">1</span>
            <button class="desserts__qty-increment qty-crement">
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
              >
                <path
                  fill="#fff"
                  d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    
      <div class="desserts__info">
        <p class="desserts__category">${item.category}</p>
        <h2 class="desserts__name">${item.name}</h2>
        <p class="desserts__price">$${item.price.toFixed(2)}</p>
      </div>
    </div>
    `;
  });

  dessertsContainer.innerHTML = html;

  document.querySelectorAll(".desserts__cart-btn").forEach((btn) => {
    btn.addEventListener("click", handleClick);
  });

  document.querySelectorAll(".desserts__qty-decrement").forEach((btn) => {
    btn.addEventListener("click", valDecrement);
  });

  document.querySelectorAll(".desserts__qty-increment").forEach((btn) => {
    btn.addEventListener("click", valIncrement);
  });
}

function handleClick(event) {
  const clickedButton = event.currentTarget;
  const parentItem = clickedButton.closest(".desserts__item");
  const itemIndex = parentItem.querySelector(".desserts__image").dataset.index;
  const itemName = parentItem.querySelector(".desserts__name").textContent;
  const itemPrice = parseFloat(
    parentItem.querySelector(".desserts__price").textContent.replace("$", "")
  );

  clickedButton.style.display = "none";
  const quantityContainer = parentItem.querySelector(".desserts__quantity");
  quantityContainer.style.display = "flex";

  const imageToSelect = document.querySelector(
    `.desserts__image[data-index="${itemIndex}"]`
  );
  if (imageToSelect) {
    imageToSelect.classList.add("selected");
  }

  const existingItem = cartItems.find((item) => item.index === itemIndex);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      index: itemIndex,
      name: itemName,
      price: itemPrice,
      quantity: 1,
    });
  }
  updateCart();
}

function valIncrement(event) {
  const clickedButton = event.currentTarget;
  const parentItem = clickedButton.closest(".desserts__item");
  const valueIndex = parentItem.querySelector(".desserts__qty-value");

  let val = parseInt(valueIndex.textContent, 10);
  valueIndex.textContent = val + 1;

  const itemIndex = parentItem.querySelector(".desserts__image").dataset.index;
  const existingItem = cartItems.find((item) => item.index === itemIndex);
  if (existingItem) {
    existingItem.quantity += 1;
  }
  updateCart();
}

function valDecrement(event) {
  const clickedButton = event.currentTarget;
  const parentItem = clickedButton.closest(".desserts__item");
  const valueIndex = parentItem.querySelector(".desserts__qty-value");

  let val = parseInt(valueIndex.textContent, 10);

  if (val > 1) {
    valueIndex.textContent = val - 1;

    const itemIndex =
      parentItem.querySelector(".desserts__image").dataset.index;
    const existingItem = cartItems.find((item) => item.index === itemIndex);
    if (existingItem) {
      existingItem.quantity -= 1;
    }
  } else {
    const quantityContainer = parentItem.querySelector(".desserts__quantity");
    quantityContainer.style.display = "none";
    parentItem.querySelector(".desserts__cart-btn").style.display = "flex";

    const itemIndex =
      parentItem.querySelector(".desserts__image").dataset.index;
    const existingItemIndex = cartItems.findIndex(
      (item) => item.index === itemIndex
    );
    if (existingItemIndex !== -1) {
      cartItems.splice(existingItemIndex, 1);
      const imageToDeselect = document.querySelector(
        `.desserts__image[data-index="${itemIndex}"]`
      );
      if (imageToDeselect) {
        imageToDeselect.classList.remove("selected");
      }
    }
  }
  updateCart();
}

function updateCart() {
  cartContainer.innerHTML = "";
  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
    cartContainer.innerHTML += `
    <div class="cart__item-wrap">
      <div class="cart__item">
        <div class="cart__item-text">
          <p class="cart__item-name">${item.name}</p>
          <div class="cart__item-info">
            <p class="cart__item-qty">${item.quantity}x</p>
            <div class="cart__item-prices">
              <span class="cart__item-price-unit">@$${item.price.toFixed(
                2
              )}</span>
              <span class="cart__item-price-total">$${(
                item.price * item.quantity
              ).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button class="cart__remove-btn" data-index="${item.index}">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.25C5.125 1.25 1.25 5.125 1.25 10C1.25 14.875 5.125 18.75 10 18.75C14.875 18.75 18.75 14.875 18.75 10C18.75 5.125 14.875 1.25 10 1.25ZM10 17.5C5.875 17.5 2.5 14.125 2.5 10C2.5 5.875 5.875 2.5 10 2.5C14.125 2.5 17.5 5.875 17.5 10C17.5 14.125 14.125 17.5 10 17.5Z" fill="#AD8A85"/>
            <path d="M13.375 14.375L10 11L6.625 14.375L5.625 13.375L9 10L5.625 6.625L6.625 5.625L10 9L13.375 5.625L14.375 6.625L11 10L14.375 13.375L13.375 14.375Z" fill="#AD8A85"/>
          </svg>
        </button>
      </div>
      <hr class="cart__divider" />
    </div>
    `;
  });

  cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

  if (cartItems.length > 0) {
    cartEmpty.style.display = "none";
    cartSelected.style.display = "flex";
  } else {
    cartEmpty.style.display = "flex";
    cartSelected.style.display = "none";
  }

  cartCount.textContent = cartItems.length;

  document.querySelectorAll(".cart__remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeCartItem);

    updateDialogContent();
  });
}

function removeCartItem(event) {
  const clickedButton = event.currentTarget;
  const itemIndex = clickedButton.dataset.index;

  cartItems = cartItems.filter((item) => item.index !== itemIndex);
  updateCart();

  const parentItem = document
    .querySelector(
      `.desserts__item .desserts__image[data-index="${itemIndex}"]`
    )
    .closest(".desserts__item");
  parentItem.querySelector(".desserts__cart-btn").style.display = "flex";
  parentItem.querySelector(".desserts__quantity").style.display = "none";

  const quantityValue = parentItem.querySelector(".desserts__qty-value");
  if (quantityValue) {
    quantityValue.textContent = "1";
  }

  const imageToDeselect = document.querySelector(
    `.desserts__image[data-index="${itemIndex}"]`
  );
  if (imageToDeselect) {
    imageToDeselect.classList.remove("selected");
  }
}

function updateDialogContent() {
  const dialogContent = document.querySelector(".dialog__cart");
  dialogContent.innerHTML = "";

  let totalPrice = 0;

  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
    const dessert = dessertsData[item.index];

    dialogContent.innerHTML += `
    <div class="cart-item">
      <div class="cart-item__wrap">
        <img
          class="cart-item__image"
          src="${dessert.image.thumbnail}"
          alt="${item.name}"
        />
        <div class="cart-item__details">
          <p class="cart-item__name">${item.name}</p>
          <div class="cart-item__quantity">
            <p class="cart-item__qty">${item.quantity}x</p>
            <span class="cart-item__price-unit">@$${item.price.toFixed(
              2
            )}</span>
          </div>
        </div>
      </div>

      <span class="cart-item__price-total">$${(
        item.price * item.quantity
      ).toFixed(2)}</span>
    </div>
    `;
  });

  dialog.querySelector(
    ".cart__total-price"
  ).textContent = `$${totalPrice.toFixed(2)}`;
}

const dialog = document.querySelector("dialog");
const openDialogBtn = document.querySelector(".open-dialog");
const closeDialogBtn = document.querySelector(".close-dialog");

openDialogBtn.addEventListener("click", () => {
  dialog.showModal();
  document.body.classList.add("dialog-open");
});

closeDialogBtn.addEventListener("click", () => {
  cartItems = [];
  updateCart();

  document.querySelectorAll(".desserts__item").forEach((item) => {
    const cartBtn = item.querySelector(".desserts__cart-btn");
    const quantityContainer = item.querySelector(".desserts__quantity");
    const quantityValue = item.querySelector(".desserts__qty-value");
    const image = item.querySelector(".desserts__image");

    cartBtn.style.display = "flex";
    quantityContainer.style.display = "none";
    quantityValue.textContent = "1";
    image.classList.remove("selected");
  });

  dialog.close();
  document.body.classList.remove("dialog-open");
});