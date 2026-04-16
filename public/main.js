// main.js
let cart = [];
let allPasky = []; // Зберігаємо всі паски тут

// 1. Отримуємо дані
axios.get("https://easter-cake.onrender.com/api/pasky")
    .then(res => {
        allPasky = res.data;
        renderPasky(allPasky);
    });

// 2. Рендеримо картки (Тільки фото і назва)
function renderPasky(data) {
    let html = data.map((el, index) => `
        <div class="card" onclick="openModal(${index})">
            <img src="${el.image}">
            <div class="card-content">
                <h2>${el.name}</h2>
                <p><b>${el.price} грн</b></p>
                <button class="btn">Детальніше</button>
            </div>
        </div>
    `).join('');
    $(".pasky-container").html(html);
}

// 3. Логіка Попапу
function openModal(index) {
    const item = allPasky[index];
    const modalHtml = `
        <img src="${item.image}">
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <p>Ціна: ${item.price} грн</p>
        <button class="btn" onclick="addToCart('${item.name}', ${item.price})">Купити зараз</button>
    `;
    $("#modal-body").html(modalHtml);
    $("#paska-modal").css("display", "flex");
}

// Закриття попапу
$(".close-modal").click(() => $("#paska-modal").hide());
$(window).click((e) => { if(e.target.id == "paska-modal") $("#paska-modal").hide(); });

// 4. Логіка Кошика
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    $("#paska-modal").hide(); // Закриваємо попап після покупки
    $("#cart-sidebar").addClass("active");
}

// Видалення з кошика
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    $("#cart-count").text(cart.length);
    let itemsHtml = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name} - ${item.price} грн</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
        </div>
    `).join('');
    
    $("#cart-items").html(itemsHtml);
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    $("#total-price").text(total);
}

// Керування кошиком
$("#cart-icon").click(() => $("#cart-sidebar").addClass("active"));
$("#close-cart").click(() => $("#cart-sidebar").removeClass("active"));