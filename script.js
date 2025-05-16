// Variáveis globais
let cart = [];
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const categoriaBtns = document.querySelectorAll('.categoria-btn');
const categoriasProdutos = document.querySelectorAll('.categoria-produtos');

// Abrir/fechar carrinho
openCartBtn.addEventListener('click', () => {
    cartOverlay.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

// Adicionar ao carrinho
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');
        
        addToCart(id, name, price, img);
    });
});

// Função para adicionar item ao carrinho
function addToCart(id, name, price, img) {
    // Verifica se o item já está no carrinho
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            img,
            quantity: 1
        });
    }
    
    updateCart();
    cartOverlay.classList.add('active');
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
    // Atualiza a contagem do carrinho
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Atualiza os itens do carrinho
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Adiciona eventos aos botões de remover
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                removeFromCart(id);
            });
        });
    }
    
    // Atualiza o total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
}

// Finalizar pedido via WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    let message = `Olá, gostaria de fazer um pedido:\n\n`;
    
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\nTotal: R$ ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
    message += `\n\nMeus dados:\nNome: \nEndereço: \nTelefone: `;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5521988304627?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
});

// Filtro por categorias
categoriaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Atualiza botão ativo
        categoriaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const categoria = btn.getAttribute('data-categoria');
        
        // Mostra/oculta categorias
        categoriasProdutos.forEach(secao => {
            if (categoria === 'todos' || secao.getAttribute('data-categoria') === categoria) {
                secao.style.display = 'block';
            } else {
                secao.style.display = 'none';
            }
        });
    });
});