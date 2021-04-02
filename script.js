const productsContainer = document.getElementById('products')

let BASE_URL = 'http://127.0.0.1:3000'

async function getProducts() {
    try {
        const response = await fetch(`${BASE_URL}/products`)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        // Catch errors
    }
}

getProducts()
