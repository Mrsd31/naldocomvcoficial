document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let cart = [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');
    const categoriaBtns = document.querySelectorAll('.categoria-btn');
    const categoriasProdutos = document.querySelectorAll('.categoria-produtos');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const scrollToOfertasBtn = document.getElementById('scroll-to-ofertas');
    
    // Inicializar contador de ofertas
    initializeOfertasCounter();
    
    // Event Listeners
    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', finalizarPedidoWhatsApp);
    
    // Filtro de categorias
    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.getAttribute('data-categoria');
            filterProducts(categoria);
            
            // Atualizar botões ativos
            categoriaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Scroll para seção se não for "Todos"
            if (categoria !== 'todos') {
                const section = document.querySelector(`[data-categoria="${categoria}"]`);
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Adicionar ao carrinho
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');
            
            addToCart(id, name, price, img);
            
            // Feedback visual
            btn.textContent = 'Adicionado!';
            btn.style.backgroundColor = '#25D366';
            setTimeout(() => {
                btn.textContent = 'Adicionar ao Carrinho';
                btn.style.backgroundColor = '#333';
            }, 1000);
        });
    });
    
    // Scroll para ofertas
    if (scrollToOfertasBtn) {
        scrollToOfertasBtn.addEventListener('click', () => {
            const ofertasSection = document.querySelector('.oferta-especial');
            ofertasSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Funções
    function filterProducts(categoria) {
        if (categoria === 'todos') {
            categoriasProdutos.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            categoriasProdutos.forEach(section => {
                if (section.getAttribute('data-categoria') === categoria) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    }
    
    function addToCart(id, name, price, img) {
        // Verificar se o item já está no carrinho
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
        openCart();
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    function updateCart() {
        // Atualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Atualizar lista de itens
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio</p>';
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">R$ ${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Adicionar event listeners aos botões de remover
            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    removeFromCart(btn.getAttribute('data-id'));
                });
            });
        }
        
        // Atualizar total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    function openCart() {
        cartOverlay.classList.add('active');
    }
    
    function closeCart() {
        cartOverlay.classList.remove('active');
    }
    
    function finalizarPedidoWhatsApp() {
        const nome = document.getElementById('cliente-nome').value;
        const endereco = document.getElementById('cliente-endereco').value;
        const telefone = document.getElementById('cliente-telefone').value;
        const observacoes = document.getElementById('cliente-observacoes').value;
        
        // Validar campos obrigatórios
        if (!nome || !endereco || !telefone) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        // Formatar mensagem
        let mensagem = `*Pedido via Naldo.comvocê*%0A%0A`;
        mensagem += `*Nome:* ${nome}%0A`;
        mensagem += `*Endereço:* ${endereco}%0A`;
        mensagem += `*WhatsApp:* ${telefone}%0A`;
        
        if (observacoes) {
            mensagem += `*Observações:* ${observacoes}%0A%0A`;
        } else {
            mensagem += `%0A`;
        }
        
        mensagem += `*Itens do Pedido:*%0A%0A`;
        
        cart.forEach(item => {
            mensagem += `➡ ${item.name}%0A`;
            mensagem += `💰 R$ ${item.price.toFixed(2)} × ${item.quantity}%0A%0A`;
        });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        mensagem += `*Total: R$ ${total.toFixed(2)}*%0A%0A`;
        mensagem += `Obrigado pelo seu pedido!`;
        
        // Abrir WhatsApp
        window.open(`https://wa.me/5521988304627?text=${mensagem}`, '_blank');
    }
    
    function initializeOfertasCounter() {
        const contadorTempo = document.getElementById('contador-tempo');
        
        if (contadorTempo) {
            let horas = 24;
            let minutos = 59;
            let segundos = 59;
            
            setInterval(() => {
                segundos--;
                
                if (segundos < 0) {
                    segundos = 59;
                    minutos--;
                }
                
                if (minutos < 0) {
                    minutos = 59;
                    horas--;
                }
                
                if (horas < 0) {
                    horas = 0;
                    minutos = 0;
                    segundos = 0;
                }
                
                contadorTempo.textContent = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }
    
    // Mostrar categoria "Todos" por padrão
    filterProducts('todos');
});