export default class Cart {

	// !!!!this code should be refactored. it's shit!
	
	add(product, qty, id) {
		// the id parameter is to compare the producs and aviod object comparing methods 
		//which in this case can lead to unwanted behavior
		const cartContent = sessionStorage.getItem('cart');
		const inputQty = document.querySelector('.js-quantity');
		const qtyBanner = document.querySelector('#js-qty-banner');
		const stock = document.querySelector('#js-stock');
		
		if (parseInt(inputQty.value) > parseInt(stock.textContent)) {
			qtyBanner.classList.remove('hidden', 'js-added');
			qtyBanner.classList.add('js-not-added');
			qtyBanner.textContent = 'There is not enough products in stock. Qty set to the maximum stock';
			setTimeout(() => {
				qtyBanner.classList.add('hidden', 'js-not-added');
				qtyBanner.textContent = '';
			}, 3500);
			// set the input qty to maximul found in stock
			inputQty.value = parseInt(stock.textContent);
		} else {
			if (cartContent === null) {
				const result = { 'Quantity': parseInt(qty), 'Details': product, 'Id': parseInt(id) };
				sessionStorage.setItem('cart', JSON.stringify([result]));

			} else {
				const data = JSON.parse(cartContent);
				let alreadyInCart = false;
				data.map((item, index) => {
					// check by id if the product is already in cart
					if (item.Id === parseInt(id)) {
						//just update quantity
						item.Quantity = parseInt(item.Quantity) + parseInt(qty);
						sessionStorage.setItem('cart', JSON.stringify(data));
						alreadyInCart = true;
					}
				});

				if (!alreadyInCart) {
					// add product to sessionStoarage object
					const rowData = JSON.parse(sessionStorage.getItem('cart'));
					rowData.push({ 'Quantity': parseInt(qty), 'Details': product, 'Id': parseInt(id) });
					sessionStorage.setItem('cart', JSON.stringify(rowData));
				}
			}
			// add message - refactor this shit
			qtyBanner.classList.remove('hidden', 'js-not-added');
			qtyBanner.classList.add('js-added');
			qtyBanner.textContent = 'Product succesfully added to cart.';
			setTimeout(() => {
				qtyBanner.classList.add('hidden', 'js-added');
				qtyBanner.textContent = '';
			}, 3500);

			Cart.updateCartCount();
		}
	}

	delete() {
		// find the product and remove it from the array, then rebuild the items in cart
		const element = document.querySelector('#js-cart-product-list');
		if (element) {
			element.addEventListener('click', (evt) => {
				const target = evt.target;
				if (target.innerText === 'X') {
					// !!be carefoul if you change X with some other icon or text!!
					let productId = parseInt(target.parentElement.dataset.productId);
					const rawData = JSON.parse(sessionStorage.getItem('cart'));
					rawData.map((itm, idx) => {
						if (productId === itm.Id) {
							rawData.splice(idx, 1);
						}
					});
					sessionStorage.setItem('cart', JSON.stringify(rawData));
					Cart.updateCartCount();
					this.displayCart();
				}
			})
		}
	}

	decreaseQty() {
		const element = document.querySelector('#js-cart-product-list');
		if (element) {
			element.addEventListener('click', (evt) => {
				const target = evt.target;
				if (target.innerText === '-') {
					// !!be carefoul if you change "-" with some other icon or text!!
					let productId = parseInt(target.parentElement.parentElement.dataset.productId);
					const rawData = JSON.parse(sessionStorage.getItem('cart'));
					rawData.map((itm, idx) => {
						if (productId === itm.Id) {
							itm.Quantity -= 1;
							if (itm.Quantity === 0) {
								rawData.splice(idx, 1);
							}
						}
					});
					sessionStorage.setItem('cart', JSON.stringify(rawData));
					Cart.updateCartCount();
					this.displayCart();
				}
			})
		}
	}

	increaseQty() {
		const element = document.querySelector('#js-cart-product-list');
		if (element) {
			element.addEventListener('click', (evt) => {
				const target = evt.target;
				if (target.innerText === '+') {
					// !!be carefoul if you change "-" with some other icon or text!!
					let productId = parseInt(target.parentElement.parentElement.dataset.productId);
					const rawData = JSON.parse(sessionStorage.getItem('cart'));
					rawData.map((itm, idx) => {
						if (productId === itm.Id) {
							itm.Quantity += 1;
						}
					});
					sessionStorage.setItem('cart', JSON.stringify(rawData));
					Cart.updateCartCount();
					this.displayCart();
				}
			})
		}
	}

	displayCart() {
		//get all cart content from sesstionStorage and then print it to the page.
		const rawData = JSON.parse(sessionStorage.getItem('cart'));
		const details = document.querySelector('#js-cart-product-list');
		const totalProducts = document.querySelector('#js-total-products');
		const totalPrice = document.querySelector('#js-total-price');
		let productListhtml = '';
		
		if (sessionStorage.getItem('cart') !== null) {
			rawData.forEach(product => {
				productListhtml += `
				    
					<li class="d-flex" data-product-id="${product.Id}">
						<div class="width-20"><a href="/details.html?id=${product.Id}">${product.Details.title}</a></div>
						<div class="width-20">${product.Details.price}RON</div>
						<div class="width-20"><span class="js-minus">-</span>${product.Quantity}<span class="js-plus">+</span></div>
						<div class="width-20">${product.Quantity * parseInt(product.Details.price)}RON</div>
						<div class="width-20" class="js-remove">X</div>
					</li>
				`
			});
			if (details || totalProducts || totalPrice) {
				details.innerHTML = productListhtml;
				totalProducts.textContent = rawData.length;
				totalPrice.textContent = rawData.reduce((acc, value) => acc + (parseInt(value.Quantity) * parseInt(value.Details.price)), 0);
			}
		}

	}

	static updateCartCount() {
		const countElement = document.querySelector('#js-class-count');
		if (sessionStorage.getItem('cart') !== null) {
			countElement.textContent = JSON.parse(sessionStorage.getItem('cart')).length;
		}	
	}
}