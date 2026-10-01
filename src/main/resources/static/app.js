let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];
let currentPage = 1;

const productsPerPage = 12;
let wishlist =
    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];
let allProducts = [];
if(document.getElementById("products")){

    loadProducts();
}

if(document.getElementById("wishlist")){

    renderWishlist();
}

if(document.getElementById("cart")){

    renderCart();
}

if(document.getElementById("orders")){

    loadOrders();
}

if(document.getElementById("adminOrders")){

    loadAdminOrders();
}
if(document.getElementById("productDetails")){

    loadProductDetails();
}

if(document.getElementById("cartCount")){

    updateCartCount();
}

if(document.getElementById("wishlistCount")){

    updateWishlistCount();
}


checkLoginStatus();

if(typeof loadProfile === "function"){

    loadProfile();
}

if(typeof hideAdminSection === "function"){

    hideAdminSection();
}
async function loadProductDetails(){

    const params =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        params.get("id");

    if(!productId) return;

    const response =
        await fetch(
            "http://localhost:8080/api/products"
        );

    const products =
        await response.json();

    const product =
        products.find(
            p => p.id == productId
        );

    const container =
        document.getElementById(
            "productDetails"
        );

    if(!container) return;

    container.innerHTML = `

        <div class="details-card">

            ${product.imageUrl}

            <div>

                <h1>
                    ${product.name}
                </h1>

                <span class="badge">
                    ${product.category}
                </span>

                <p>
                    ⭐ ${product.rating}/5
                </p>

                <h2>
                    ₹${product.price}
                </h2>

                <p>
                    ${product.description}
                </p>

                <button
                    onclick="addToCart(${product.id})">

                    Add To Cart

                </button>

                <button
                    onclick="addToWishlist(${product.id})">

                    Add To Wishlist

                </button>

            </div>

        </div>
    `;
}
function checkAuth(){

    const token =
        localStorage.getItem("token");

    if(!token){

        window.location.href =
            "login.html";
    }
}
if(

    window.location.pathname.includes(
        "products.html"
    )

    ||

    window.location.pathname.includes(
        "wishlist.html"
    )

    ||

    window.location.pathname.includes(
        "cart.html"
    )

    ||

    window.location.pathname.includes(
        "checkout.html"
    )

    ||

    window.location.pathname.includes(
        "orders.html"
    )

){

    checkAuth();
}
function redirectIfLoggedIn(){

    const token =
        localStorage.getItem("token");

    if(token){

        window.location.href =
            "products.html";
    }
}
function showRegister(){

    document.getElementById(
        "registerSection"
    ).style.display = "block";

    document.getElementById(
        "loginSection"
    ).style.display = "none";
}

async function loadAdminOrders() {

    const response =
        await fetch("/api/orders");

    const orders =
        await response.json();

    const container =
        document.getElementById(
            "adminOrders"
        );

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `
            <div class="card">

                <h3>
                    ${order.customerName}
                </h3>

                <p>
                    ${order.products}
                </p>

                <p>
                    ₹${order.total}
                </p>

                <p>
    Status:
    <span class="${order.status.toLowerCase()}">
        ${order.status}
    </span>
</p>
                <select
                    onchange="updateStatus(
                        ${order.id},
                        this.value
                    )">

                    <option value="PENDING">
                        PENDING
                    </option>

                    <option value="SHIPPED">
                        SHIPPED
                    </option>

                    <option value="DELIVERED">
                        DELIVERED
                    </option>

                </select>

            </div>
        `;
    });
}
function hideAdminSection(){

    const email =
        localStorage.getItem("email");

    if(email === "admin@gmail.com"){

        document.getElementById(
            "adminSection"
        ).style.display = "block";
    }
    else{

        document.getElementById(
            "adminSection"
        ).style.display = "none";
    }
}

async function updateStatus(
    orderId,
    status
) {

    const response =
        await fetch(
            `/api/orders/${orderId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    status
                })
            }
        );

    if(response.ok){

        alert(
            "Status Updated"
        );

        loadAdminOrders();
        loadOrders();

    } else {

        alert(
            "Update Failed"
        );
    }
}
function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");
}

function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );

    if(!toast){
        return;
    }

    toast.innerText =
        message;

    toast.style.display =
        "block";

    setTimeout(() => {

        toast.style.display =
            "none";

    },2000);
}
async function loadOrders() {

    const response =
        await fetch("/api/orders");

    const orders =
        await response.json();

    const ordersDiv =
        document.getElementById("orders");

    ordersDiv.innerHTML = "";

    orders.forEach(order => {

        ordersDiv.innerHTML += `
            <div class="card">

                <h3>${order.customerName}</h3>

                <p>
                    Products:
                    ${order.products}
                </p>

                <p>
                    Total:
                    ₹${order.total}
                </p>

                <p>
    Status:
    <span class="${order.status.toLowerCase()}">
        ${order.status}
    </span>
</p>

            </div>
        `;
    });
}
function showLogin(){

    document.getElementById(
        "loginSection"
    ).style.display = "block";

    document.getElementById(
        "registerSection"
    ).style.display = "none";
}

async function registerUser() {

    const username =
        document.getElementById("regUsername").value;

    const email =
        document.getElementById("regEmail").value;

    const password =
        document.getElementById("regPassword").value;

    const response = await fetch(
        "/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );

    alert(await response.text());
}
function checkLoginStatus(){

    const email =
        localStorage.getItem("email");

    const welcome =
        document.getElementById(
            "welcomeUser"
        );

    if(email && welcome){

        welcome.innerText =
            "Welcome, " + email;
    }
}
async function loginUser() {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const response = await fetch(
        "/api/auth/login",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if(response.ok){

    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "email",
        email
    );

    showToast(
        "✅ Login Successful"
    );

    window.location.href =
        "products.html";
}
}

function logout(){

    localStorage.clear();

    window.location.href =
        "index.html";
}
async function placeOrder() {

    if(cart.length === 0){
        alert("Cart Empty");
        return;
    }

    const customerName =
        prompt("Enter Name");

    const customerEmail =
        prompt("Enter Email");

    const customerPhone =
        prompt("Enter Phone");

    const customerAddress =
        prompt("Enter Address");

    const total =
        cart.reduce(
            (sum,item)=>
            sum + Number(item.price),
            0
        );

    const productNames =
        cart.map(p => p.name)
            .join(",");

    const response =
        await fetch(
            "/api/orders",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                    customerName,
                    customerEmail,
                    customerPhone,
                    customerAddress,
                    products:productNames,
                    total,
                    status:"PENDING"
                })
            }
        );

    if(response.ok){

        showToast(
    "✅ Order Placed Successfully"
);
window.location.href =
"orders.html";

        cart = [];

renderCart();

loadOrders();
    }
    else{

        alert("Order Failed");
    }
}
function addToCart(productId){

    const product =
        allProducts.find(
            p => p.id === productId
        );

    const existing =
        cart.find(
            item => item.id === productId
        );

    if(existing){

        existing.quantity++;
    }
    else{

        cart.push({

            ...product,

            quantity: 1

        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    showToast("🛒 Added To Cart");
}
function renderCart() {

    const cartDiv =
        document.getElementById("cart");

    if(!cartDiv) return;

    if(cart.length === 0){

    cartDiv.innerHTML = `

        <div class="empty-cart">

            <div class="empty-cart-card">

                <h1>🛒</h1>

                <h2>Your Cart Is Empty</h2>

                <p>
                    Looks like you haven't added
                    anything to your cart yet.
                </p>

                <button
                    onclick="window.location.href='products.html'">

                    Continue Shopping

                </button>

            </div>

        </div>

    `;

    const totalDiv =
        document.getElementById(
            "cartTotal"
        );

    if(totalDiv){

        totalDiv.innerHTML = "";
    }
    const checkout =
    document.getElementById(
        "checkoutSection"
    );

if(checkout){

    checkout.style.display =
        "none";
}


    return;
}

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        const quantity =
            item.quantity || 1;

        total +=
            item.price * quantity;

        cartDiv.innerHTML += `

            <div class="card">

                <img src="${item.imageUrl}">

                <h3>${item.name}</h3>

                <p>
                    Price: ₹${item.price}
                </p>

                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})">
                        -
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

                <button
                    onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>

        `;
    });

    const totalDiv =
    document.getElementById(
        "cartTotal"
    );

if(totalDiv){

    totalDiv.innerHTML = `

        <h2>
            Total: ₹${total.toFixed(2)}
        </h2>

    `;
}
}
function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}
function increaseQuantity(index){

    cart[index].quantity =
        (cart[index].quantity || 1) + 1;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}
function decreaseQuantity(index){

    if(
        (cart[index].quantity || 1) > 1
    ){
        cart[index].quantity--;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}
function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
    updateCartCount();
    renderCart();
}
async function placeOrder() {

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const customerName =
    document.getElementById(
        "customerName"
    ).value;

const customerEmail =
    document.getElementById(
        "customerEmail"
    ).value;

const customerPhone =
    document.getElementById(
        "customerPhone"
    ).value;

const customerAddress =
    document.getElementById(
        "customerAddress"
    ).value;

    const total =
    cart.reduce(
        (sum, item) =>
            sum +
            (Number(item.price)
            * item.quantity),
        0
    );

    const products =
        cart.map(item => item.name)
            .join(", ");

    const response =
        await fetch(
            "/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    customerPhone,
                    customerAddress,
                    products,
                    total,
                    status: "PENDING"
                })
            }
        );

    if (response.ok) {

        alert(
            "Order placed successfully"
        );

        cart = [];

localStorage.removeItem("cart");

renderCart();
updateCartCount();
loadOrders();
    } else {

        alert(
            "Order placement failed"
        );
    }
}
function searchProducts() {

    const keyword =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();

    const filteredProducts =
        allProducts.filter(product =>
            product.name
                .toLowerCase()
                .includes(keyword)
        );

    currentPage = 1;

renderProducts(filteredProducts);
}
function renderProducts(products) {

    const container =
        document.getElementById("products");

    container.innerHTML = "";

    const start =
        (currentPage - 1)
        * productsPerPage;

    const end =
        start + productsPerPage;

    const paginatedProducts =
        products.slice(start, end);

    paginatedProducts.forEach(product => {

        container.innerHTML += `
            <div class="card">

              <img src="${product.imageUrl}"
                <h3>${product.name}</h3>
                <span class="badge">
    ${product.category}
</span>
                <p class="rating">
                    ⭐ ${product.rating}
                </p>

                <h4>₹${product.price}</h4>
                <span class="badge">
${product.category}
</span>
                <button onclick="
window.location.href=
'product-details.html?id=${product.id}'
">

    View Details

</button>

                <button onclick="addToWishlist(${product.id})">
                    ❤️ Wishlist
                </button>

                <button onclick="addToCart(${product.id})">
                    🛒 Add To Cart
                </button>

            </div>
        `;
    });
    renderPagination(products);
}
function renderPagination(products){

    const pagination =
        document.getElementById(
            "pagination"
        );

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            products.length
            / productsPerPage
        );

    for(let i = 1; i <= totalPages; i++){

        pagination.innerHTML += `
            <button
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
}
function changePage(page){

    currentPage = page;

    renderProducts(allProducts);
}
function addToWishlist(productId){

    const product =
        allProducts.find(
            p => p.id === productId
        );

    const existing =
        wishlist.find(
            p => p.id === productId
        );

    if(existing){

        alert("Already in wishlist");

        return;
    }

    wishlist.push(product);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    renderWishlist();
    updateWishlistCount();
}
function renderWishlist(){
    if(wishlist.length === 0){

    container.innerHTML = `
        <div class="empty-section">

            <h2>❤️</h2>

            <h3>Wishlist Is Empty</h3>

        </div>
    `;

    return;
}
    const container =
        document.getElementById(
            "wishlist"
        );

    container.innerHTML = "";

    wishlist.forEach((product,index)=>{

        container.innerHTML += `
            <div class="card">

                '<img src="${product.imageUrl}">'

                <h3>${product.name}</h3>

                <h4>₹${product.price}</h4>

                <button
                    onclick="removeWishlist(${index})">

                    Remove

                </button>

            </div>
        `;
    });
}
function loadCategories() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );
        categoryFilter.innerHTML = `
    <option value="all">
        All Categories
    </option>
`;

    const categories =
        [...new Set(
            allProducts.map(
                product => product.category
            )
        )];

    categories.forEach(category => {

        categoryFilter.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;
    });
}
function goToLogin(){

    window.location.href =
        "login.html";
}
function removeWishlist(index){

    wishlist.splice(index,1);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    renderWishlist();
    updateWishlistCount();
}
function sortProducts() {

    const value =
        document.getElementById(
            "sortProducts"
        ).value;

    let sortedProducts =
        [...allProducts];

    if(value === "lowToHigh") {

        sortedProducts.sort(
            (a,b) =>
            a.price - b.price
        );
    }

    if(value === "highToLow") {

        sortedProducts.sort(
            (a,b) =>
            b.price - a.price
        );
    }
    currentPage = 1;
    renderProducts(
        sortedProducts
    );
}
function renderFeaturedProducts(products){

    const container =
        document.getElementById(
            "featuredProducts"
        );

    container.innerHTML = "";

    products.forEach(product => {

    console.log(product);

    container.innerHTML += `
        <div class="card">

            '<img src="${product.imageUrl}">'

            <h4>${product.name}</h4>

        </div>
    `;
});
}
function updateWishlistCount(){

    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );

    if(wishlistCount){

        wishlistCount.innerText =
            wishlist.length;
    }
}
function checkLoginStatus() {

    const token =
        localStorage.getItem("token");

    if (token) {

        document.getElementById(
            "loginBtn"
        ).style.display = "none";

        document.getElementById(
            "registerBtn"
        ).style.display = "none";

        const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if(logoutBtn){

    logoutBtn.style.display =
        "inline-block";
}

        const email =
    localStorage.getItem("email");

document.getElementById(
    "welcomeUser"
).innerText =
    "Welcome, " + email;
    }
}
function updateCartCount(){

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if(cartCount){

        cartCount.innerText =
            cart.length;
    }
}
function filterCategory() {

    const category =
        document.getElementById(
            "categoryFilter"
        ).value;

    if(category === "all") {

        currentPage = 1;

        renderProducts(allProducts);

        return;
    }

    const filteredProducts =
        allProducts.filter(
            product =>
            product.category === category
        );

    currentPage = 1;

    renderProducts(
        filteredProducts
    );
}
async function loadProducts(){
    document.getElementById(
    "loader"
).style.display = "block";
    const response =
        await fetch("/api/products");

    allProducts =
        await response.json();

    const products =
        allProducts;

    renderProducts(products);
    loadCategories();
    document.getElementById(
    "loader"
).style.display = "none";
    const count =
    document.getElementById(
        "productCount"
    );

if(count){

    count.innerText =
        allProducts.length +
        " Products";
}
}