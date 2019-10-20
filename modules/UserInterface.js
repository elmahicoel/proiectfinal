export default class UserInterface {

	createProductList(data) {
		// console.log(data)
		const productElement = document.querySelector('#products');
		let html = '';
			data.forEach((product, idx) => {
				html += `
				<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 G centru" id="list-${idx}">
					<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 centru"><img src="${product.image}"
									alt="Produs"
									class="poza">
						<h4>${product.title}</h4>
						<h3>${product.price}</h3>
						<button id="detaild-${idx}">DETALII</button>
					</div>
				</div>
			`
			});
		
		if (productElement) {
			productElement.innerHTML = html;
		}
	}

	createProductLink(data) {
		for (let i = 0; i < data.length; i++) {
			if(data[i]=== null)continue;
			const detailsBtn = document.querySelector(`#detaild-${i}`);
			if (detailsBtn) {
				detailsBtn.addEventListener('click', () => {
					window.location.href = `/details.html?id=${i}`;
				});
			}
		}
	}

	// find product fron data feed based on the product ID fron querystring
	findProduct(data) {
		const queryString = new URLSearchParams(window.location.search);
		const id = parseInt(queryString.get('id'));

		if (queryString.has('id')) {
			for (let i = 0; i < data.length; i++) {
				if (i === id) {
					return data[i];
				}
			}
		}
		return new Error(`There is no product with the specified ID=${id}`);
	}
	
	createProductDetail(product) {
		const details = document.querySelector('#details');
		if (details) {
			details.innerHTML = `
				<div class="col-xs-12 main">
					<div>
						<img src="${product.image}" alt="" class="main-pic">
					</div>
					<div class="detalii-produs">
							<h3>${product.title}</h3>
							<div>${product.description}</div>
							<h3>${product.price}</h3>
							<hr>           
							<div>In stoc: <span id="js-stock">${product.stoc}</span></div>
							<div class="quantity">Cantitate:<input type="number" class="js-quantity" min="1" value="1"></input></div>
							<button class="js-add-to-cart">aduaga-produs</button>
					</div>
				</div>`
		}
	}

	createAdminProductList(data) {
		const details = document.querySelector('#js-admin-product-list');
		let html = '';
		data.forEach((product, idx) => {
			html += `
			<li class="d-flex" id="list-${idx}">
				<div class="width-20"><img src="${product.image}" class="icon"></div>
				<div class="width-20 pointer" id="detaild-${idx}">${product.title}</div>
				<div class="width-20">${product.price}</div>
				<div class="width-20">${product.stoc}</div>
				<div><button id="${idx}">Remove</button></div>
			</li>
			`
		});
		if (details){
		details.innerHTML = html;
	}
    }

	createAdminProductDetails(product) {
		const details = document.querySelector('#js-admin-detail');
		if (details) {
			details.innerHTML = `
		<div>
			<div class="gap-bigger">Imagine: </div>
			<div class="gap-bigger">Nume: </div>
			<div class="gap-bigger">Descriere</div>
			<div class="gap-bigger">Cantitate</div>
			<div class="gap-bigger">Pret</div>
		</div>
		<div>
			<div class="gap"><input type="text" class="big-input" value="${product.image}"></div>
			<div class="gap"><input type="text" class="big-input" value="${product.title}"></div>
			<div class="gap"><input type="text" class="big-input" value="${product.description}"></div>
			<div class="gap"><input type="text" class="big-input" value="${product.stoc}"></div>
			<div class="gap"><input class="big-input" value="${product.price}"></div>
		</div>
		`	
		}
	}

	createProducAdmintLink(data) {
		for (let i in data) {
			const detailsBtn = document.querySelector(`#detaild-${i}`);
			detailsBtn.addEventListener('click', () => {
				window.location.href = `/admin-details.html?id=${i}`;
			});
		}
	}
}