// --- 1. GERADOR DE PRODUTOS (MOCK DE BANCO DE DADOS) ---
// Como pedido, vamos criar um mostruário com mais de 100 peças. 
// Para ser dinâmico e leve, o script cria os produtos automaticamente.

const categories = ['Camisetas', 'Calças', 'Vestidos', 'Casacos', 'Acessórios'];
const baseGenders = ['Masculino', 'Feminino', 'Unissex'];

const productNames = {
    'Camisetas': ['Camiseta Básica Algodão', 'Polo Clássica', 'T-Shirt Oversized', 'Regata Esportiva', 'Camiseta Estampada Premium', 'Camiseta Longline'],
    'Calças': ['Jeans Skinny', 'Calça de Alfaiataria', 'Jogger Conforto', 'Calça Cargo Urban', 'Jeans Reta Tradicional', 'Calça Chino'],
    'Vestidos': ['Vestido Midi Floral', 'Vestido Longo Elegance', 'Vestido Curto Festa', 'Vestido de Linho Verão', 'Vestido Tubinho Clássico', 'Vestido Transpassado'],
    'Casacos': ['Jaqueta de Couro P.U', 'Sobretudo de Lã', 'Corta-Vento Esportivo', 'Blazer Slim Fit', 'Cardigan de Tricô', 'Jaqueta Jeans Vintage'],
    'Acessórios': ['Relógio Minimalista', 'Óculos de Sol Aviador', 'Bolsa Tiracolo de Couro', 'Cinto de Couro Genuíno', 'Colar Delicado Prata', 'Mochila Urbana']
};

let allProducts = [];
let productIdCounter = 1;

// Gerando 24 produtos por categoria = 120 produtos no total
categories.forEach(category => {
    for (let i = 0; i < 24; i++) {
        // Escolhe um nome aleatório da categoria
        let nameList = productNames[category];
        let randomName = nameList[Math.floor(Math.random() * nameList.length)];
        
        // Vestidos são 100% femininos por padrão neste array
        let gender = category === 'Vestidos' ? 'Feminino' : baseGenders[Math.floor(Math.random() * baseGenders.length)];
        
        // Gera um preço aleatório entre R$ 50 e R$ 450
        let randomPrice = (Math.random() * (450 - 50) + 50).toFixed(2);

        // Usando o picsum para gerar imagens placeholder diferentes para cada roupa
        let imageUrl = `https://picsum.photos/seed/roupa${productIdCounter}/300/400`;

        allProducts.push({
            id: productIdCounter,
            name: randomName,
            category: category,
            gender: gender,
            price: randomPrice,
            image: imageUrl
        });
        
        productIdCounter++;
    }
});

// Embaralhar o array para a vitrine principal ficar variada (Fisher-Yates Shuffle)
for (let i = allProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
}

// --- 2. LÓGICA DE RENDERIZAÇÃO E FILTROS ---

const productGrid = document.getElementById('product-grid');
const productCounter = document.getElementById('product-counter');
const categoryTitle = document.getElementById('current-category-title');
let cartCount = 0;

// Função para renderizar os produtos na tela
function renderProducts(productsToRender) {
    productGrid.innerHTML = ''; // Limpa o grid atual
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.2rem;">Nenhum produto encontrado para estes filtros.</p>';
        productCounter.innerText = "0 produtos";
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="product-info">
                <p class="product-category">${product.gender} | ${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.replace('.', ',')}</p>
                <button class="btn-add-cart" onclick="addToCart()">Adicionar ao Carrinho</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    productCounter.innerText = `${productsToRender.length} produtos`;
}

// Lógica do Carrinho Simples
window.addToCart = function() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    // Animação leve no botão de carrinho
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
};

// Filtro Híbrido (Categoria + Gênero)
let currentCategory = 'Todos';
let currentGender = 'Todos';

function applyFilters() {
    let filtered = allProducts;

    if (currentCategory !== 'Todos') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (currentGender !== 'Todos') {
        filtered = filtered.filter(p => p.gender === currentGender || p.gender === 'Unissex'); 
        // Se a pessoa buscar Masculino, mostramos Masculino e Unissex
    }

    renderProducts(filtered);
}

// Capturando cliques na Navegação (Categorias)
const navLinks = document.querySelectorAll('#nav-categories a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Impede que a página recarregue
        
        // Remove 'active' de todos e adiciona no clicado
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        // Atualiza categoria e aplica filtros
        currentCategory = e.target.getAttribute('data-category');
        categoryTitle.innerText = `Mostrando: ${currentCategory}`;
        applyFilters();
    });
});

// Capturando mudanças nos Radios de Gênero (Sidebar)
const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentGender = e.target.value;
        applyFilters();
    });
});

// Inicialização: Renderiza todos os produtos ao carregar a página
window.onload = () => {
    renderProducts(allProducts);
};
