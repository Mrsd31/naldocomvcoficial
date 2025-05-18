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
const subcategoriasContainer = document.getElementById('subcategorias-container');

// Mapeamento de subcategorias por categoria
const subcategoriasPorCategoria = {
    'grafica-rapida': ['cartao-visita', 'panfleto', 'banner', 'vinil', 'foto-10x15', 'foto-a4'],
    'personalizados': ['blusa-body', 'caneca', 'copo-longdrink', 'azulejo', 'outros-personalizados'],
    'bazar': ['todos-bazar', 'decoracao', 'utensilios-domesticos', 'beleza', 'lazer', 'eletronicos', 'pet', 'papelaria', 'natal', 'frete-gratis']
};

// Nomes amigáveis para subcategorias
const subcategoriaNomes = {
    'cartao-visita': 'Cartão de Visita',
    'panfleto': 'Panfleto',
    'banner': 'Banner',
    'vinil': 'Vinil',
    'foto-10x15': 'Foto 10x15',
    'foto-a4': 'Foto A4',
    'blusa-body': 'Blusa e Body',
    'caneca': 'Caneca',
    'copo-longdrink': 'Copo Longdrink',
    'azulejo': 'Azulejo',
    'outros-personalizados': 'Outros',
    'todos-bazar': 'Todos',
    'decoracao': 'Decoração',
    'utensilios-domesticos': 'Utensílios Domésticos',
    'beleza': 'Beleza',
    'lazer': 'Lazer',
    'eletronicos': 'Eletrônicos',
    'pet': 'Pet',
    'papelaria': 'Papelaria',
    'natal': 'Natal',
    'frete-gratis': 'Frete Grátis'
};

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
    
    // Feedback visual
    const button = document.querySelector(`.add-to-cart[data-id="${id}"]`);
    button.textContent = 'Adicionado!';
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.textContent = 'Adicionar ao Carrinho';
        button.style.backgroundColor = 'var(--amarelo-primario)';
    }, 1000);
}

// Função para remover item do carrinho
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Função para atualizar quantidade no carrinho
function updateQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity > 0 ? newQuantity : 1;
        updateCart();
    }
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
                    <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Adiciona eventos aos botões de remover e quantidade
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                removeFromCart(id);
            });
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    updateQuantity(id, item.quantity - 1);
                } else {
                    removeFromCart(id);
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    updateQuantity(id, item.quantity + 1);
                }
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
    const whatsappUrl = `https://wa.me/552198834627?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
});

// Filtro por categorias
categoriaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Atualiza botão ativo
        categoriaBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const categoria = btn.getAttribute('data-categoria');
        
        // Atualiza subcategorias
        updateSubcategorias(categoria);
        
        // Mostra/oculta produtos por categoria
        categoriasProdutos.forEach(secao => {
            if (categoria === 'todos' || secao.getAttribute('data-categoria') === categoria) {
                secao.style.display = 'block';
            } else {
                secao.style.display = 'none';
            }
        });
    });
});

// Função para atualizar as subcategorias exibidas
function updateSubcategorias(categoria) {
    subcategoriasContainer.innerHTML = '';
    
    if (categoria === 'todos' || !subcategoriasPorCategoria[categoria]) {
        subcategoriasContainer.classList.remove('active');
        return;
    }
    
    subcategoriasContainer.classList.add('active');
    
    // Botão "Todos" para a categoria
    const todosBtn = document.createElement('button');
    todosBtn.className = 'subcategoria-btn active';
    todosBtn.textContent = 'Todos';
    todosBtn.setAttribute('data-subcategoria', 'todos');
    todosBtn.addEventListener('click', () => {
        document.querySelectorAll('.subcategoria-btn').forEach(btn => btn.classList.remove('active'));
        todosBtn.classList.add('active');
        
        document.querySelectorAll('.subcategoria-produtos').forEach(sub => {
            if (sub.parentElement.getAttribute('data-categoria') === categoria) {
                sub.style.display = 'block';
            }
        });
    });
    subcategoriasContainer.appendChild(todosBtn);
    
    // Botões para cada subcategoria
    subcategoriasPorCategoria[categoria].forEach(sub => {
        const subBtn = document.createElement('button');
        subBtn.className = 'subcategoria-btn';
        subBtn.textContent = subcategoriaNomes[sub];
        subBtn.setAttribute('data-subcategoria', sub);
        subBtn.addEventListener('click', () => {
            document.querySelectorAll('.subcategoria-btn').forEach(btn => btn.classList.remove('active'));
            subBtn.classList.add('active');
            
            document.querySelectorAll('.subcategoria-produtos').forEach(subElement => {
                if (subElement.parentElement.getAttribute('data-categoria') === categoria) {
                    if (subElement.getAttribute('data-subcategoria') === sub || sub === 'todos-bazar') {
                        subElement.style.display = 'block';
                    } else {
                        subElement.style.display = 'none';
                    }
                }
            });
        });
        subcategoriasContainer.appendChild(subBtn);
    });
}

// Inicializa a página mostrando todos os produtos
document.querySelector('.categoria-btn.active').click();

const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.nav-dot');
let currentIndex = 0;

function moveToSlide(index) {
  currentIndex = index;
  slides.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % 4;
  moveToSlide(currentIndex);
}, 5000);

