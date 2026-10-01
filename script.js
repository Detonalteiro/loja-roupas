// ==========================================
// 1. LÓGICA DO MODO ESCURO (DARK MODE)
// ==========================================
const btnTema = document.getElementById('btn-tema');
const body = document.body;

// Verifica se o usuário já tinha escolhido o tema escuro na última visita
if (localStorage.getItem('tema') === 'escuro') {
    body.classList.add('dark');
    btnTema.innerText = '☀️';
}

btnTema.addEventListener('click', () => {
    body.classList.toggle('dark');
    
    // Salva a escolha do usuário no navegador (Local Storage)
    if (body.classList.contains('dark')) {
        localStorage.setItem('tema', 'escuro');
        btnTema.innerText = '☀️';
    } else {
        localStorage.setItem('tema', 'claro');
        btnTema.innerText = '🌙';
    }
});

// ==========================================
// 2. SISTEMA DE FILTRO DE PRODUTOS
// ==========================================
const botoesFiltro = document.querySelectorAll('.btn-filtro');
const cardsProduto = document.querySelectorAll('.card');

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        // Remove a classe 'ativo' de todos os botões e coloca só no clicado
        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');

        const categoriaEscolhida = botao.getAttribute('data-filtro');

        // Mostra ou esconde os produtos com base na categoria
        cardsProduto.forEach(card => {
            const categoriaCard = card.getAttribute('data-categoria');
            
            if (categoriaEscolhida === 'todos' || categoriaEscolhida === categoriaCard) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==========================================
// 3. JANELA MODAL E INTEGRAÇÃO WHATSAPP
// ==========================================
const modal = document.getElementById('modal-produto');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const botoesAbrirModal = document.querySelectorAll('.btn-abrir-modal');
const btnWhatsApp = document.getElementById('btn-comprar-whatsapp');

const numeroWhatsApp = "5581999999999"; // Coloque o número do cliente aqui

// Preenche e abre o modal quando clica no botão "Ver Detalhes"
botoesAbrirModal.forEach(botao => {
    botao.addEventListener('click', function() {
        const nome = this.getAttribute('data-nome');
        const preco = this.getAttribute('data-preco');
        const imgUrl = this.getAttribute('data-img');

        // Injeciona os dados do produto dentro do Modal
        document.getElementById('modal-titulo').innerText = nome;
        document.getElementById('modal-preco').innerText = preco;
        document.getElementById('modal-img').src = imgUrl;

        // Configura o link do WhatsApp dinamicamente
        const mensagem = encodeURIComponent(`Olá! Quero comprar o produto: ${nome} por ${preco}.`);
        btnWhatsApp.onclick = () => window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, '_blank');

        // Mostra o Modal com animação suave
        modal.classList.add('visivel');
    });
});

// Fecha o modal ao clicar no 'X'
btnFecharModal.addEventListener('click', () => {
    modal.classList.remove('visivel');
});

// Fecha o modal se o usuário clicar no fundo escuro fora da janela
modal.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.classList.remove('visivel');
    }
});
