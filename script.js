// Pega o botão e o espaço da mensagem que vamos colocar no HTML
const botaoComprar = document.getElementById('btn-comprar');
const mensagem = document.getElementById('mensagem-aviso');

// Adiciona uma ação de clique (evento) ao botão
botaoComprar.addEventListener('click', function() {
    
    // 1. Muda o texto e a cor do botão na hora do clique
    botaoComprar.innerText = "Redirecionando...";
    botaoComprar.style.backgroundColor = "#999";

    // 2. Mostra a mensagem escondida
    mensagem.style.display = "block";
    mensagem.innerText = "Abrindo o WhatsApp da loja...";

    // 3. Cria um atraso de 2 segundos (2000 milissegundos) para simular o carregamento
    setTimeout(function() {
        // Aqui entraria o link real do WhatsApp no projeto final
        alert("Simulação: O cliente seria levado para o WhatsApp agora!");
        
        // 4. Volta o botão ao normal depois que o alerta é fechado
        botaoComprar.innerText = "Comprar no WhatsApp";
        botaoComprar.style.backgroundColor = "#25D366";
        mensagem.style.display = "none";
    }, 2000);
});
