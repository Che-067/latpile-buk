import { cart,removeFromCart,updateCartQuantity, saveToStorage,updateNewQuantity } from './data/cart.js';
import {products} from './data/products.js';
import {formatCurrency} from './utils/money.js';
//using esm library its an external library that accepts being used as module format
import dayjs  from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from './data/deliveryOptions.js';

console.log(dayjs()); 
let cartSummary = [];

cart.forEach((cartItem) => {

const productId = cartItem.productId;

let matchingItem;
  
products.forEach((product) => {
  if (product.id === productId)
matchingItem = product;
});



const druben = `<div class="cart-item-container js-cart-item-container-${matchingItem.id}"
 data-product-id="${matchingItem.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingItem.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingItem.name}
        </div>
        <div class="product-price">
          $${(matchingItem.priceCents / 100).toFixed(2)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quanity-
            label-${matchingItem.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link"
          data-product-id="${matchingItem.id}">
            Update
          </span>

          <input class="quantity-input js-quantity-input-${matchingItem.id}"> <span class="save-quantity-link
           link-primary js-save-link"data-product-id="${matchingItem.id}">Save</span>
          <span class="delete-quantity-link link-primary js-delete-link"
          data-product-id="${matchingItem.id}">
          Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivjkjnvvvvjjjjvjjery option:
        </div>
        ${deliveryOptionsHTML(matchingItem)}
      </div>
    </div>
  </div>
`;
cartSummary += druben;
});



// GENERATING HTML FOR DELIVERY-OPTIONS

function deliveryOptionsHTML(matchingItem,cartItem) {

  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,'days');
      const dateString = deliveryDate.format('dddd,MMMM D');
        const priceString = deliveryOption.priceCents === 0 ? 
        'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
        

  const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
       html +=
      `<div class="delivery-option">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
        `
  });
  return html;
}

document.querySelector('.order-summary').innerHTML = cartSummary;


document.querySelectorAll('.js-delete-link').forEach((link) => {
link.addEventListener('click',() => {
const productId = link.dataset.productId;

removeFromCart(productId);

const container = document.querySelector(`.js-cart-item-container-${productId}`);
console.log(container);
container.remove();


updateCartQuantity('.js-cart-quantity','items');
});

});

updateCartQuantity('.js-cart-quantity','items');

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click',() => {
    let productId = link.dataset.productId;
   
     const container = document.querySelector(`.js-cart-item-container-${productId}`);
     container.classList.add('is-editing-quantity');
     
   
  });

  });

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click',() => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove('is-editing-quantity');
    
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput.value);

    // Validation
    if (newQuantity > 0 && newQuantity < 1000) {
      updateNewQuantity(productId, newQuantity);
      
      // Update the quantity display
      const quantityLabel = document.querySelector(`.js-quanity-label-${productId}`);
      quantityLabel.innerHTML = newQuantity;
      
      // Update cart quantity in header
      updateCartQuantity('.js-cart-quantity', 'items');
    } else {
      alert('Quantity must be between 1 and 1000');
    }
  });
});

function handleQuantityInputKeydown(event) {
  if (event.key === 'Enter') {
    // Get the product ID from the input's parent container
    const container = event.target.closest('.js-cart-item-container');
    const productId = container.dataset.productId; // Make sure your container has data-product-id
    
    // Exit edit mode
    container.classList.remove('is-editing-quantity');
    
    // Get the new quantity value
    const newQuantity = Number(event.target.value);
    
    // Validation
    if (newQuantity > 0 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);
      
      // Update the quantity display
      const quantityLabel = container.querySelector('.js-quanity-label');
      quantityLabel.innerHTML = newQuantity;
      
      // Update cart total
      updateCartQuantity('.js-cart-quantity', 'items');
    } else {
      alert('Quantity must be between 1 and 1000');
    }
  }
}
 
// Add event listeners to all quantity inputs
document.querySelectorAll('.js-quantity-input').forEach(input => {
  input.addEventListener('keydown', handleQuantityInputKeydown);
})

const today  = dayjs();
const deliveryDate = today.add(5,'days');

//FORMATTING DAYJS
console.log(deliveryDate.format('dddd,MMMM D'));

