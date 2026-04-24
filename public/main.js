
let cart = [];
let allPasky = []; 

axios.get("https://easter-cake.onrender.com/api/pasky")
    .then(res => {
        allPasky = res.data;
        renderPasky(allPasky);
    });


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

$(".close-modal").click(() => $("#paska-modal").hide());
$(window).click((e) => { if(e.target.id == "paska-modal") $("#paska-modal").hide(); });


function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    $("#paska-modal").hide(); 
    $("#cart-sidebar").addClass("active");
}

function showToast(text) {
    const toast = $(`<div class="toast">${text}</div>`);
    $("body").append(toast);

    setTimeout(() => toast.addClass("show"), 10);
    setTimeout(() => toast.remove(), 2000);
}

$(document).on("click", "#checkout-btn", function() {
    console.log("Кнопка натиснута!"); // Перевір, чи з'явиться цей напис в консолі
    
    const phone = $("#user-phone").val();
    if(!phone) {
        alert("Введіть телефон!");
        return;
    }

    // Твій запит
    axios.post("http://localhost:3000/order", {
        phone: phone,
        items: cart,
        total: $("#total-price").text()
    })
    .then(res => {
        alert("Замовлення прийнято!");
        cart = [];
        updateCartUI();
    })
    .catch(err => {
        console.error("Помилка відправки:", err);
        alert("Помилка сервера. Перевір консоль!");
    });
});

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
$("#search").on("input", filterPasky);
$("#category").on("change", filterPasky);

function filterPasky() {
    let search = $("#search").val().toLowerCase();
    let category = $("#category").val();

    let filtered = allPasky.filter(el => {
        let matchName = el.name.toLowerCase().includes(search);

        // тимчасова логіка категорій
        let matchCategory = true;

        if(category === "chocolate"){
            matchCategory = el.name.toLowerCase().includes("шоколад");
        }
        if(category === "classic"){
            matchCategory = el.price < 500;
        }
        if(category === "premium"){
            matchCategory = el.price > 800;
        }

        return matchName && matchCategory;
    });

    renderPasky(filtered);
}
function updateCartUI() {
    $("#cart-count").text(cart.length);

    if(cart.length === 0){
        $("#cart-items").html("<p>Порожньо 🧺</p>");
    } else {
        let itemsHtml = cart.map((item, index) => `
            <div class="cart-item">
                <div>${item.name}</div>
                <div><b>${item.price} грн</b></div>
                <button onclick="removeFromCart(${index})">❌</button>
            </div>
        `).join('');

        $("#cart-items").html(itemsHtml);
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    $("#total-price").text(total);
}


$("#cart-icon").click(() => $("#cart-sidebar").addClass("active"));
$("#close-cart").click(() => $("#cart-sidebar").removeClass("active"));