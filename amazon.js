import {products} from './data/products.js';
import {cart,saveToStorage,updateCartQuantity} from './data/cart.js';


let product = '';
products.forEach((products) => {
let productHTML = `
    <div class="products-grid">
<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${products.image}">
          </div>
 
          <div class="product-name limit-text-to-2-lines">
           ${products.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${products.rating.stars * 10}.png"> 
            <div class="product-rating-count link-primary">
              ${products.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(products.priceCents / 100).toFixed(2)}
          </div>
          
          <div class="product-quantity-container">
            <select class="item-quantity-${products.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-display-added-${products.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id = "${products.id}">
            Add to Cart
          </button>
        </div></div> `;

       product += productHTML;
      });

      document.querySelector('.products-grid').innerHTML = product;


let timeoutId;

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click',() => {
   let { productId } = button.dataset; 
    let matchingItem;
 
     let itemQuantity = document.querySelector
  (`.item-quantity-${productId}`);

  let quantity = Number(itemQuantity.value);

     function cartItemExport(productId) {

   cart.forEach((item) => {
    if (productId === item.productId) {
       matchingItem = item;
    }
    
    });
    
     if (matchingItem) {
      matchingItem.quantity += quantity;
     
    } else {
     cart.push({
    productId,
    quantity,
    deliveryOptionId: '1'
   }); 
   
  }
     }
     cartItemExport(productId);

  saveToStorage();
 
   updateCartQuantity('.cart-quantity','');

     let waffenSS = document.querySelector(`.js-display-added-${productId}`);
   waffenSS.classList.add('added-to-cart-visible');

   clearTimeout(timeoutId);
   timeoutId = setTimeout( () => {
   waffenSS.classList.remove('added-to-cart-visible');
    },2000);
  });
  });
   

   
   
  
