const products = [
  {
    id: 1,
    name: "Kundan Solitaire Ring",
    price: 45999,
    material: "gold",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    description:
      "Handcrafted Kundan ring featuring intricate gold work and uncut diamonds. This timeless piece combines traditional craftsmanship with contemporary design.",
    specifications: [
      "22K Gold",
      "Kundan Setting",
      "Weight: 8g",
      "Size Available: 14-22",
    ],
  },
  {
    id: 2,
    name: "Oxidized Silver Band",
    price: 12999,
    material: "silver",
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500",
    description:
      "Antique finish oxidized silver band with traditional motifs. Perfect for both casual and formal wear.",
    specifications: [
      "Pure Silver",
      "Oxidized Finish",
      "Weight: 5g",
      "Size Available: 12-22",
    ],
  },
  {
    id: 3,
    name: "Polki Diamond Ring",
    price: 89999,
    material: "platinum",
    image:
      "https://parade.com/.image/t_share/MTkwNTgxNDQ0Njk5MjM2MjIw/top-fake-diamond-rings.png",
    description:
      "Exquisite Polki diamond ring set in platinum. Features uncut diamonds in traditional Polki setting with modern finishing.",
    specifications: [
      "Platinum",
      "Polki Diamonds",
      "Weight: 6g",
      "Size Available: 14-20",
    ],
  },
  {
    id: 4,
    name: "Temple Work Ring",
    price: 34999,
    material: "gold",
    image: "https://en.pimg.jp/083/128/847/1/83128847.jpg",
    description:
      "Inspired by South Indian temple architecture, this ring features intricate temple work patterns in pure gold.",
    specifications: [
      "22K Gold",
      "Temple Design",
      "Weight: 7g",
      "Size Available: 14-22",
    ],
  },
  {
    id: 5,
    name: "Meenakari Silver Ring",
    price: 18999,
    material: "silver",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500",
    description:
      "Delicate Meenakari work on silver, featuring traditional Rajasthani enamel art with floral patterns.",
    specifications: [
      "Pure Silver",
      "Meenakari Work",
      "Weight: 4g",
      "Size Available: 12-22",
    ],
  },
  {
    id: 6,
    name: "Diamond Solitaire",
    price: 149999,
    material: "platinum",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    description:
      "Modern solitaire ring featuring a brilliant-cut diamond in a contemporary platinum setting.",
    specifications: [
      "Platinum",
      "VS Clarity",
      "Weight: 4g",
      "Size Available: 14-20",
    ],
  },
];

let cart = [];

// DOM Elements
const productsContainer = document.getElementById("products");
const cartIcon = document.querySelector(".cart");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.getElementById("cart-total");
const materialFilter = document.getElementById("material-filter");
const priceFilter = document.getElementById("price-filter");
const productModal = document.getElementById("product-modal");

// Event Listeners
cartIcon.addEventListener("click", toggleCart);
materialFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("product-modal-close") ||
    e.target.classList.contains("product-modal")
  ) {
    closeProductModal();
  }
});

// Format price in Indian Rupees
function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Functions
function displayProducts(productsToShow = products) {
  productsContainer.innerHTML = productsToShow
    .map(
      (product) => `
    <div class="product-card" onclick="openProductModal(${product.id})">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="add-to-cart" onclick="addToCart(${
          product.id
        }); event.stopPropagation();">
          Add to Cart
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    productModal.innerHTML = `
      <div class="product-modal-content">
        <button class="product-modal-close">×</button>
        <div class="product-modal-grid">
          <div class="product-modal-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-modal-details">
            <h2>${product.name}</h2>
            <p class="product-modal-price">${formatPrice(product.price)}</p>
            <p class="product-modal-description">${product.description}</p>
            <div class="product-modal-specs">
              <h3>Specifications</h3>
              <ul>
                ${product.specifications
                  .map((spec) => `<li>${spec}</li>`)
                  .join("")}
              </ul>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    productModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeProductModal() {
  productModal.classList.remove("active");
  document.body.style.overflow = "";
}

function filterProducts() {
  const materialValue = materialFilter.value;
  const priceValue = priceFilter.value;

  let filtered = [...products];

  if (materialValue) {
    filtered = filtered.filter((product) => product.material === materialValue);
  }

  if (priceValue) {
    const [min, max] = priceValue
      .split("-")
      .map((val) => (val === "+" ? Infinity : Number(val)));
    filtered = filtered.filter(
      (product) =>
        product.price >= min && (max === Infinity || product.price <= max)
    );
  }

  displayProducts(filtered);
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
  }
}

function updateCart() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)} x ${item.quantity}</p>
      </div>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
}

function toggleCart() {
  cartModal.classList.toggle("active");
}

// Initialize
window.addToCart = addToCart;
window.openProductModal = openProductModal;
displayProducts();
updateCart();
