const productsContainer = document.getElementById('products')
const form = document.getElementById('form')
const loader = document.getElementById('loader')
const categoriesContainer = document.getElementById('categories')

// const BASE_URL = 'https://enigmatic-shelf-95625.herokuapp.com/products'
const BASE_URL = 'http://localhost:3000'

// Initially get all the products
getProducts(BASE_URL + '/products')
// And all the categories for the dropdown
getCategories(BASE_URL + '/categories')

async function getProducts(url) {
  try {
    // Clear products first
    productsContainer.innerHTML = ''
    loader.hidden = false
    const response = await fetch(url)
    const data = await response.json()
    showProducts(data)
  } catch (err) {
    console.error(`${err.name}: ${err.message}`)
  } finally {
    loader.hidden = true
  }
}

function showProducts(products) {
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

async function getCategories(url) {
  try {
    // Clear categories first
    categories.innerHTML = ''
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    listCategories(data)
  } catch (err) {
    console.error(`${err.name}: ${err.message}`)
  }
}

function listCategories(categories) {
  categories.forEach((category) => {
    const categoryName = category.name[0].toUpperCase() + category.name.slice(1)
    const categoryItem = document.createElement('li')
    categoryItem.addEventListener('click', () => {
      getProducts(BASE_URL + `/products?category_id=${category.id}`)
    })
    categoryItem.innerHTML = `
      <a class="dropdown-item category" id="category-${category.id}">${categoryName}</a>
    `
    categoriesContainer.append(categoryItem)
  })
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let { query } = e.target.elements
  query = query.value.toLowerCase()
  getProducts(BASE_URL + `/products?q=${query}`)
})

// Get all products when clear search input
form.addEventListener('search', (e) => {
  if (e.target.value === '') {
    getProducts(BASE_URL + '/products')
  }
})

// Hacer un fetch de categories
// obtener los nombres, luego iterarlos
// por cada uno crear un li para el select

// categories.forEach((category) => {
//   console.log(category)
// })

// drop.addEventListener('click', () => {
//   getProducts(BASE_URL + `products?category_id=3`)
// })
