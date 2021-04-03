const productsContainer = document.getElementById('products')
const form = document.getElementById('form')
const loader = document.getElementById('loader')

let BASE_URL = 'https://enigmatic-shelf-95625.herokuapp.com/products'

// Initially get all the products
getProducts(BASE_URL)

async function getProducts(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    showProducts(data)
  } catch (err) {
    console.error(`${err.name}: ${err.message}`)
  }
}

function showProducts(products) {
  // Clear products first
  productsContainer.innerHTML = ''

  if (products.length > 0) {
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
            <div class="d-flex justify-content-between align-items-center">
              <p class="card-text">${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.price)}</p>
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
  } else {
    const productNotFound = document.createElement('h2')
    productNotFound.classList.add('not-found')
    productNotFound.innerHTML = 'Temporarily out of stock 😔'
    productsContainer.append(productNotFound)
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let { query } = e.target.elements
  query = query.value.toLowerCase()
  getProducts(BASE_URL + `?q=${query}`)
})

// Get all products when clear search input
form.addEventListener('search', (e) => {
  if (e.target.value === '') {
    getProducts(BASE_URL)
  }
})
