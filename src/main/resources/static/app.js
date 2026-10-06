let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];
let currentPage = 1;
let adminOrdersList = [];
const productsPerPage = 12;
function goToProducts(){

    window.location.href =
        "products.html";
}
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
if(
    document.getElementById(
        "paymentAmount"
    )
){

    const total =
        localStorage.getItem(
            "paymentTotal"
        );

    document.getElementById(
        "paymentAmount"
    ).innerText =

        "Total : Rs. " + total;

    const upiLink =

        `upi://pay?pa=8688572958@ibl&pn=ShopHere&am=${total}&cu=INR`;

    new QRCode(

        document.getElementById(
            "qrCode"
        ),

        {
            text: upiLink,
            width:220,
            height:220
        }
    );
}

checkLoginStatus();
showAdminButton();

if(typeof loadProfile === "function"){

    loadProfile();
}

if(typeof hideAdminSection === "function"){

    hideAdminSection();
}
const passwordField =
    document.getElementById(
        "regPassword"
    );

if(passwordField){

    passwordField.addEventListener(
        "input",
        function(){

            const passwordError =
                document.getElementById(
                    "passwordError"
                );

            const regex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

            if(regex.test(this.value)){

                passwordError.style.color =
                    "#10b981";

                passwordError.innerText =
                    "✅ Strong Password";

            }else{

                passwordError.style.color =
                    "#ef4444";

                passwordError.innerText =
                    "Use 8+ characters, uppercase, lowercase, number and special character";
            }
        }
    );
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
            "/api/products"
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

    if(!container || !product) return;

    container.innerHTML = `

        <div class="breadcrumb">

            <a href="products.html">

                Products

            </a>

            <span>›</span>

            <span>

                ${product.name}

            </span>

        </div>

        <div class="details-card">

            <img src="${product.imageUrl}">

            <div class="details-content">

                <h1>
                    ${product.name}
                </h1>

                <span class="badge">
                    ${product.category}
                </span>

                <p class="rating">
                    ⭐ ${product.rating}/5
                </p>

                <h2 class="price">
                    ₹${product.price}
                </h2>

                <p class="description">
                    ${product.description}
                </p>

                <div class="details-buttons">

                    <button
                        onclick="addToCart(${product.id})">

                        🛒 Add To Cart

                    </button>

                    <button
                        onclick="addToWishlist(${product.id})">

                        ❤️ Add To Wishlist

                    </button>

                </div>

            </div>

        </div>

    `;
}
function showAdminButton(){

    const email =
        localStorage.getItem(
            "email"
        );

    const adminBtn =
        document.getElementById(
            "adminBtn"
        );

    console.log(
        "Email:",
        email
    );

    console.log(
        "Admin Button:",
        adminBtn
    );

    if(!adminBtn){
        return;
    }

    if(email === "admin@gmail.com"){

        adminBtn.style.display =
            "inline-block";
    }
}
async function deleteProduct(id){

    const response =
        await fetch(
            `/api/products/${id}`,
            {
                method:"DELETE"
            }
        );

    if(response.ok){

        showToast(
            "🗑️ Product Deleted"
        );

        location.reload();
    }
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

async function loadAdminOrders(){

    const response =
        await fetch("/api/orders");

    const orders =
        await response.json();

    adminOrdersList = orders;

    updateDashboardStats(
        orders
    );

    const container =
        document.getElementById(
            "adminOrders"
        );

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `

            <div class="card">

                <h3>
                    📦 Order #${order.id}
                </h3>

                <p>
                    Customer:
                    ${order.customerName}
                </p>

                <p class="order-products">
    ${order.products}
</p>

                <p>
                    ₹${Number(
                        order.total
                    ).toFixed(2)}
                </p>

                <p>
                    Status:
                    <span class="${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </p>

                <select
                    onchange="
                        updateStatus(
                            ${order.id},
                            this.value
                        )
                    ">

                    <option
                        value="PENDING"
                        ${
                            order.status === "PENDING"
                            ? "selected"
                            : ""
                        }>

                        PENDING

                    </option>

                    <option
                        value="SHIPPED"
                        ${
                            order.status === "SHIPPED"
                            ? "selected"
                            : ""
                        }>

                        SHIPPED

                    </option>

                    <option
                        value="DELIVERED"
                        ${
                            order.status === "DELIVERED"
                            ? "selected"
                            : ""
                        }>

                        DELIVERED

                    </option>

                </select>

            </div>

        `;
    });
}
function loadAdminProducts(products){

    const container =
        document.getElementById(
            "adminProducts"
        );

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `

            <div class="product-card">

                ${product.imageUrl}

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ₹${product.price}
                </p>

                <button
                    onclick="editProduct(${product.id})">

                    Edit

                </button>

                <button
                    onclick="deleteProduct(${product.id})">

                    Delete

                </button>

            </div>

        `;
    });
}
function showAddProductForm(){

    document.getElementById(
        "productForm"
    ).innerHTML = `

        <div class="form-card">

            <input
                id="productName"
                placeholder="Product Name">

            <input
                id="productPrice"
                placeholder="Price">

            <input
                id="productCategory"
                placeholder="Category">

            <input
                id="productImage"
                placeholder="Image URL">

            <textarea
                id="productDescription"
                placeholder="Description">
            </textarea>

            <button
                onclick="addProduct()">

                Save Product

            </button>

        </div>

    `;
}
async function addProduct(){

    const product = {

        name:
            document.getElementById(
                "productName"
            ).value,

        price:
            document.getElementById(
                "productPrice"
            ).value,

        category:
            document.getElementById(
                "productCategory"
            ).value,

        imageUrl:
            document.getElementById(
                "productImage"
            ).value,

        description:
            document.getElementById(
                "productDescription"
            ).value
    };

    const response =
        await fetch(
            "/api/products",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify(
                    product
                )
            }
        );

    if(response.ok){

        showToast(
            "✅ Product Added"
        );

        loadProducts();
    }
}
function updateDashboardStats(
    orders
){

    document.getElementById(
        "totalOrders"
    ).innerText =
        orders.length;

    document.getElementById(
        "pendingOrders"
    ).innerText =
        orders.filter(
            o =>
            o.status === "PENDING"
        ).length;

    document.getElementById(
        "shippedOrders"
    ).innerText =
        orders.filter(
            o =>
            o.status === "SHIPPED"
        ).length;

    const revenue =
        orders.reduce(
            (sum,o)=>
            sum + Number(o.total),
            0
        );

    document.getElementById(
        "totalRevenue"
    ).innerText =
        "₹" +
        revenue.toFixed(2);
}
function searchOrders(){

    const keyword =
        document
        .getElementById(
            "searchOrder"
        )
        .value
        .toLowerCase();

    const filtered =
        adminOrdersList.filter(
            order =>
            order.customerName
            .toLowerCase()
            .includes(keyword)
        );

    renderAdminOrders(
        filtered
    );
}
function clearAdminFilters(){

    document.getElementById(
        "statusFilter"
    ).value = "ALL";
    updateDashboardStats(
    adminOrdersList
);
    loadAdminOrders();
}
function filterOrders(){

    const value =
        document.getElementById(
            "statusFilter"
        ).value;

    if(value === "ALL"){

        loadAdminOrders();

        return;
    }

    const filtered =
        adminOrdersList.filter(
            order =>
            order.status === value
        );
        updateDashboardStats(
    filtered
);

    const container =
        document.getElementById(
            "adminOrders"
        );

    container.innerHTML = "";

    filtered.forEach(order => {

        container.innerHTML += `

            <div class="card">

                <h3>
                    📦 Order #${order.id}
                </h3>

                <p>
                    Customer:
                    ${order.customerName}
                </p>

                <p class="order-products">
                    ${order.products}
                </p>

                <p>
                    ₹${Number(order.total).toFixed(2)}
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
function renderAdminOrders(
    orders
){

    const container =
        document.getElementById(
            "adminOrders"
        );

    container.innerHTML = "";

    orders.forEach(order => {

        container.innerHTML += `

            <div class="order-card">

                <h3>
                    📦 Order #${order.id}
                </h3>

                <p>
                    ${order.customerName}
                </p>

                <p>
                    ₹${Number(
                        order.total
                    ).toFixed(2)}
                </p>

                <p>
                    ${order.status}
                </p>

            </div>

        `;
    });
}
function hideAdminSection(){

    const adminSection =
        document.getElementById(
            "adminSection"
        );

    if(!adminSection) return;

    const email =
        localStorage.getItem(
            "email"
        );

    adminSection.style.display =
        email === "admin@gmail.com"
        ? "block"
        : "none";
}

async function updateStatus(
    orderId,
    status
){

    const response =
        await fetch(
            `/api/orders/${orderId}/status`,
            {
                method:"PUT",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    status
                })
            }
        );

    if(response.ok){

        showToast(
            "✅ Status Updated"
        );

        loadAdminOrders();

    } else {

        showToast(
            "❌ Update Failed",
            "error"
        );
    }
}
function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");
}

function showToast(message, type = "success"){

    const toast =
        document.getElementById("toast");

    if(!toast) return;

    toast.className =
        "toast " + type;

    toast.innerText =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
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

    <div class="order-card">

        <h3>
            📦 Order #${order.id}
        </h3>

        <p>
            Customer:
            ${order.customerName}
        </p>

        <p class="order-products">
            Products:
            ${order.products}
        </p>

        <p>
            Total:
            ₹${Number(order.total).toFixed(2)}
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
        const passwordError =
    document.getElementById(
        "passwordError"
    );

passwordError.innerText = "";

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if(
    !passwordRegex.test(
        password
    )
){

    passwordError.innerText =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.";

    return;
}
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

    if(response.ok){

    showToast(
        "✅ Registration Successful"
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1500);
}
else{

    showToast(
        "❌ Registration Failed",
        "error"
    );
}

}
function goToPayment(){
    const phone =
    document.getElementById(
        "customerPhone"
    ).value;

if(
    !/^[6-9]\d{9}$/.test(phone)
){

    showToast(
        "❌ Enter Valid Indian Mobile Number",
        "error"
    );

    return;
}
    const total =
        cart.reduce(

            (sum,item)=>

                sum +
                (
                    Number(item.price)
                    * item.quantity
                ),

            0
        );

    localStorage.setItem(
        "paymentTotal",
        total
    );

   

    localStorage.setItem(
        "customerEmail",
        document.getElementById(
            "customerEmail"
        ).value
    );

    localStorage.setItem(
        "customerPhone",
        document.getElementById(
            "customerPhone"
        ).value
    );

    localStorage.setItem(
        "customerAddress",
        document.getElementById(
            "customerAddress"
        ).value
    );

    window.location.href =
        "payment.html";
}
async function completePayment(){

    const success =
        await placeOrder();

    if(success){

        window.location.href =
            "payment-success.html";
    }
}

function checkLoginStatus(){

    const username =
        localStorage.getItem(
            "username"
        );

    const welcome =
        document.getElementById(
            "welcomeUser"
        );

    if(welcome){

        welcome.innerText =
            username
            ? "👤 " + username
            : "👤 User";
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
    localStorage.setItem(
    "username",
    data.username
);

    showToast(
    "✅ Login Successful"
);

setTimeout(() => {

    window.location.href =
        "products.html";

}, 1500);


    window.location.href =
        "products.html";
}
}

function logout(){

    localStorage.clear();

    window.location.href =
        "index.html";
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
        showToast(
    "🛒 Cart Is Empty",
    "warning"
);
        return;
    }

   const customerName =
    localStorage.getItem(
        "username"
    );

const customerEmail =
    localStorage.getItem(
        "customerEmail"
    );

const customerPhone =
    localStorage.getItem(
        "customerPhone"
    );

const customerAddress =
    localStorage.getItem(
        "customerAddress"
    );

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

    showToast(
        "✅ Order Placed Successfully"
    );

    cart = [];

    localStorage.removeItem(
        "cart"
    );

    renderCart();

    updateCartCount();

    return true;
}else {

    showToast(
        "❌ Order Placement Failed",
        "error"
    );

    return false;
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
            products.length /
            productsPerPage
        );

    pagination.innerHTML += `
        <button
            onclick="previousPage()">

            ← Prev

        </button>
    `;

    for(let i = 1; i <= totalPages; i++){

        pagination.innerHTML += `
            <button
                onclick="changePage(${i})">

                ${i}

            </button>
        `;
    }

    pagination.innerHTML += `
        <button
            onclick="nextPage()">

            Next →

        </button>
    `;
}
function nextPage(){

    const totalPages =
        Math.ceil(
            allProducts.length /
            productsPerPage
        );

    if(currentPage === totalPages){

        currentPage = 1;

    } else {

        currentPage++;
    }

    renderProducts(allProducts);
}
function previousPage(){

    const totalPages =
        Math.ceil(
            allProducts.length /
            productsPerPage
        );

    if(currentPage === 1){

        currentPage = totalPages;

    } else {

        currentPage--;
    }

    renderProducts(allProducts);
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

    const container =
        document.getElementById(
            "wishlist"
        );

    if(!container) return;

    if(wishlist.length === 0){

    container.innerHTML = `

        <div class="empty-card">

            <h1>❤️</h1>

            <h2>
                Your Wishlist Is Empty
            </h2>

            <p>
                Save products you love and
                come back to them later.
            </p>

            <button
                onclick="window.location.href='products.html'">

                Continue Shopping

            </button>

        </div>

    `;

    return;
}

    container.innerHTML = "";

    wishlist.forEach((product,index) => {

        container.innerHTML += `

            <div class="card">

                <img src="${product.imageUrl}">

                <h3>
                    ${product.name}
                </h3>

                <h4>
                    ₹${product.price}
                </h4>

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
function sortProducts(){

    const value =
        document.getElementById(
            "sortProducts"
        ).value;

    let sortedProducts =
        [...allProducts];

    if(value === "lowToHigh"){

        sortedProducts.sort(
            (a,b) =>
            a.price - b.price
        );
    }

    else if(value === "highToLow"){

        sortedProducts.sort(
            (a,b) =>
            b.price - a.price
        );
    }

    else if(value === "ratingHigh"){

        sortedProducts.sort(
            (a,b) =>
            b.rating - a.rating
        );
    }

    else if(value === "ratingLow"){

        sortedProducts.sort(
            (a,b) =>
            a.rating - b.rating
        );
    }

    currentPage = 1;

    renderProducts(
        sortedProducts
    );
}
function resetProducts(){

    currentPage = 1;

    document.getElementById(
        "sortProducts"
    ).value = "default";

    document.getElementById(
        "categoryFilter"
    ).value = "all";

    document.getElementById(
        "searchInput"
    ).value = "";

    renderProducts(
        allProducts
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
console.log(allProducts.length);
}