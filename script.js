const productsContainer = document.getElementById('products')

let BASE_URL = 'http://127.0.0.1:3000'

async function getProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`)
        const data = await response.json()
        console.log(data)
        showProducts(data)
    } catch (error) {
        // Catch errors
    }
}

function showProducts(products) {
    products.forEach((item) => {
        const product = document.createElement('div')
        product.classList.add('product', 'col')
        product.innerHTML = `
            <article class="card h-100">
                <img src="${
                    item.url_image || '/image-not-found.png'
                }" class="card-img-top" alt="${item.name}" />
                <div class="card-body">
                    <h5 class="card-title text-center">${item.name.toUpperCase()}</h5>
                    <div class="d-flex justify-content-between">
                        <p class="card-text">${item.price}</p>
                        <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                        >
                            <i class="icon bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `
        productsContainer.append(product)
    })
}

getProducts()
