const productsContainer = document.getElementById('products')
const categoriesContainer = document.getElementById('categories')
const cartItemsContainer = document.getElementById('cart-items')

const form = document.getElementById('form')
const loader = document.getElementById('loader')
const cartBtn = document.getElementById('cart')
const bill = document.getElementById('bill')
const restartButtons = document.querySelectorAll('.restart')

// const BASE_URL = 'https://enigmatic-shelf-95625.herokuapp.com'
const BASE_URL = 'http://localhost:3000'

let totalPrice = 0

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
        <article 
          class="card h-100" 
          id="product-${item.id}" 
          data-name="${item.name}"
          data-price="${item.price}"
        >
          <img src="${
            item.url_image || '/image-not-found.png'
          }" class="card-img-top" alt="${item.name}" />
          <div class="card-body">
            <h5 class="card-title text-center">${item.name.toUpperCase()}</h5>
            <div class="d-flex justify-content-between align-items-center">
              <p class="card-text">${formatMoney(item.price)}</p>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                onclick="addToCart(${item.id})"
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
    listCategories(data)
  } catch (err) {
    console.error(`${err.name}: ${err.message}`)
  }
}

// To create dinamically the dropdown category items
function listCategories(categories) {
  const allCategories = document.createElement('li')
  allCategories.innerHTML = `
    <a class="dropdown-item category" id="category-all">Todas</a>
  `
  allCategories.addEventListener('click', () => {
    getProducts(BASE_URL + '/products')
  })
  categoriesContainer.append(allCategories)

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

function addToCart(id) {
  const productItem = document.getElementById(`product-${id}`)
  const { name, price } = productItem.dataset

  const cartItem = document.createElement('li')
  cartItem.innerHTML = `
    <li class="d-flex justify-content-between">
      <span>${name}</span>
      <span>${formatMoney(price)}</span>
    </li>
  `
  cartItemsContainer.prepend(cartItem)

  totalPrice += parseFloat(price)
  bill.innerHTML = formatMoney(totalPrice)
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let { query } = e.target.elements
  query = query.value.toLowerCase()
  getProducts(BASE_URL + `/products?q=${query}`)
})

// To get all products when the user clears the search input
form.addEventListener('search', (e) => {
  if (e.target.value === '') {
    getProducts(BASE_URL + '/products')
  }
})

restartButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    cartItemsContainer.innerHTML = ''
    totalPrice = 0
    bill.innerHTML = totalPrice
  })
})
