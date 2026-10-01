// Seleciona todos os botões de comprar do site
const botoesComprar = document.querySelectorAll('.btn-comprar');

// Configura o número da loja (Coloque o DDD e o número, sem espaços)
const numeroWhatsApp = "5581999999999"; 

// Adiciona a ação de clique em cada botão
botoesComprar.forEach(botao => {
    botao.addEventListener('click', function() {
        
        // Pega o nome do produto e o preço que estão escondidos no HTML (data-produto e data-preco)
        const nomeDoProduto = this.getAttribute('data-produto');
        const precoDoProduto = this.getAttribute('data-preco');
        
        // Monta a mensagem que vai chegar no WhatsApp do dono da loja
        const mensagem = `Olá! Tenho interesse no produto: ${nomeDoProduto} no valor de ${precoDoProduto}. Ainda tem disponibilidade?`;
        
        // Codifica a mensagem para formato de link de internet
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Cria o link oficial da API do WhatsApp
        const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
        
        // Abre o WhatsApp em uma nova aba ou no aplicativo do celular
        window.open(linkWhatsApp, '_blank');
    });
});
