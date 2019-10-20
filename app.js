// import modules;
import GetHttpData from "./Modules/GetData.js";
import UserInterface from "./Modules/UserInterface.js";
import Cart from "./Modules/Cart.js";


// instantiate objects
const http = new GetHttpData();
const ui = new UserInterface();
const queryString = new URLSearchParams(window.location.search);
const api = 'https://mihaiproiect.firebaseio.com/.json';
const fetchedData = http.get(api).then(data => data.filter(item => Boolean(item)));
const cart = new Cart();



// generates the product list and the product page
if (queryString.has('id')) {
	fetchedData.then(data => {

		// generate the product page based on the ID
		ui.createProductDetail(ui.findProduct(data));

		// generate the admin product page based on ID
		if (window.location.href.indexOf('admin-details') > -1) {
			ui.createAdminProductDetails(ui.findProduct(data));
		}

		// attach add to cart evt to the add to cart button
		const addToCartBtn = document.querySelector('.js-add-to-cart');
		addToCartBtn.addEventListener('click', () => { 
			const quantity = document.querySelector('.js-quantity').value;
			cart.add(ui.findProduct(data), quantity, queryString.get('id'));
		});

	});
} else  {
	// generate the product list
	fetchedData.then(data => ui.createProductList(data));
	fetchedData.then(data => ui.createProductLink(data));

	fetchedData.then(data => ui.createAdminProductList(data));
	if (window.location.href.indexOf('admin') > -1) {
	 fetchedData.then(data => ui.createProducAdmintLink(data));
	}
}

// call static method when the the page loads
Cart.updateCartCount();
// call cart methods
cart.displayCart();
cart.delete();
cart.decreaseQty();
cart.increaseQty();




//Add new product
const addForm = Array.from(document.querySelectorAll('.big-input'));
const addProduct = document.querySelector('.save');
const cancel = document.querySelector('.cancel');



if (addProduct) {
	addProduct.addEventListener('click', () => {
		
		const postObj = {
			"title": addForm[1].value,
			"description": addForm[2].value,
			"image": addForm[0].value,
			"price": parseInt(addForm[4].value),
			"stoc" : parseInt(addForm[3].value)
		}
		
		http.post('https://mihaiproiect.firebaseio.com/.json', postObj)
			.then(r => console.log(r))
			.catch(err => console.log(err));
	})
}

// clear all inputs value
if (cancel) {
	cancel.addEventListener('click', () => {
		addForm[0].value = '';
		addForm[1].value = '';
		addForm[2].value = '';
		addForm[3].value = '';
		addForm[4].value = '';
	})
}

//Edit product
const editProduct = document.querySelector('.details-save');
if (editProduct) {
	editProduct.addEventListener('click', () => {
		http.put(`https://mihaiproiect.firebaseio.com/${queryString.get('id')}.json`)
			.then(r => console.log(r))
			.catch(err => console.log(err));
	})
}
// remove product from feed
const element = document.querySelector('#js-admin-product-list');
if (element) {
	element.addEventListener('click', (evt) => {
		if (evt.target.localName === "button") {
			const targetId = evt.target.id;
			fetch(`https://mihaiproiect.firebaseio.com/${targetId}.json`, {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json'
				}
			}).then(res => {
				fetchedData.then(data => ui.createAdminProductList(data));
				return res.json()
			})
				.catch(err => console.log(err));
		}
	})
}
