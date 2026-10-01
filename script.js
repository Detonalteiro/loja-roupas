// 1. SISTEMA DE CRONÔMETRO REGRESSIVO EM TEMPO REAL
function iniciarCronometros() {
    // Pega todos os elementos que vão mostrar o cronômetro no site
    const timers = document.querySelectorAll('.timer-regressivo');

    timers.forEach(timer => {
        // Lê quantas horas aquela campanha dura (está no HTML em data-horas)
        const horasDuracao = parseInt(timer.getAttribute('data-horas'));
        
        // Simula uma data de término (Soma as horas com o momento atual para o portfólio sempre funcionar)
        let dataFim = new Date();
        dataFim.setHours(dataFim.getHours() + horasDuracao);

        // Atualiza esse cronômetro a cada 1 segundo (1000 milissegundos)
        setInterval(function() {
            const agora = new Date().getTime();
            const distancia = dataFim.getTime() - agora;

            // Cálculos matemáticos para converter milissegundos em Dias, Horas, Minutos e Segundos
            const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

            // Coloca um zero na frente se o número for menor que 10 (ex: 09, 08)
            const h = horas < 10 ? "0" + horas : horas;
            const m = minutos < 10 ? "0" + minutos : minutos;
            const s = segundos < 10 ? "0" + segundos : segundos;

            // Monta o texto final na tela
            if (dias > 0) {
                timer.innerText = `${dias}d ${h}h ${m}m ${s}s`;
            } else {
                timer.innerText = `${h}h ${m}m ${s}s`;
            }

            // Se o tempo acabar
            if (distancia < 0) {
                timer.innerText = "ESGOTADO";
                timer.style.color = "#999";
            }
        }, 1000);
    });
}

// Inicia os cronômetros assim que a página carrega
iniciarCronometros();


// 2. SISTEMA DE ENTRADA NA CAMPANHA
const botoesEntrar = document.querySelectorAll('.btn-entrar');

botoesEntrar.forEach(botao => {
    botao.addEventListener('click', function() {
        const nomeMarca = this.getAttribute('data-marca');
        
        // Muda o texto do botão para dar um feedback visual
        this.innerText = "Carregando...";
        this.style.backgroundColor = "#999";

        // Simula o carregamento indo para a página da marca
        setTimeout(() => {
            alert(`Você seria redirecionado para a vitrine exclusiva da: ${nomeMarca}\n\n(Como este é um projeto de portfólio, a simulação termina aqui!)`);
            
            // Volta o botão ao normal
            this.innerText = "Entrar na Campanha";
            this.style.backgroundColor = "#111";
        }, 1000);
    });
});
