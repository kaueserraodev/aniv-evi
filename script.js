// ======================================
// VARIÁVEIS DO JOGO
// ======================================

let faseAtual = 1;
let estrelas = 0;
let baloes = 0;
let velas = 0;


// ======================================
// ELEMENTOS
// ======================================

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const telaFinal = document.getElementById("finalScreen");


// ======================================
// INICIAR JOGO
// ======================================

window.addEventListener("load", function () {

    criarEstrelas();
    atualizarProgresso();

});


// ======================================
// MOSTRAR FASE
// ======================================

function mostrarFase(numero) {

    document.querySelectorAll(".game-section").forEach(function (fase) {
        fase.classList.remove("active");
    });

    const fase = document.getElementById("phase" + numero);

    if (fase) {
        fase.classList.add("active");
    }
}


// ======================================
// ATUALIZAR PROGRESSO
// ======================================

function atualizarProgresso() {

    if (faseAtual === 1) {

        progressText.innerHTML = "Progresso: 0/3";
        progressFill.style.width = "0%";

    } else if (faseAtual === 2) {

        progressText.innerHTML = "Progresso: 1/3";
        progressFill.style.width = "33%";

    } else if (faseAtual === 3) {

        progressText.innerHTML = "Progresso: 2/3";
        progressFill.style.width = "66%";

    } else {

        progressText.innerHTML = "Progresso: 3/3";
        progressFill.style.width = "100%";

    }
}


// ======================================
// FASE 1 - ESTRELAS
// ======================================

function criarEstrelas() {

    const starGame = document.getElementById("starGame");

    for (let i = 0; i < 10; i++) {

        const estrela = document.createElement("button");

        estrela.innerHTML = "⭐";

        estrela.classList.add("game-star");

        estrela.style.left = Math.random() * 90 + "%";
        estrela.style.top = Math.random() * 85 + "%";

        estrela.addEventListener("click", function () {

            coletarEstrela(estrela);

        });

        starGame.appendChild(estrela);
    }
}


// ======================================
// COLETAR ESTRELA
// ======================================

function coletarEstrela(estrela) {

    if (estrela.classList.contains("collected")) {
        return;
    }

    estrela.classList.add("collected");

    estrelas++;

    document.getElementById("starCount").innerHTML =
        "Estrelas encontradas: " + estrelas + "/10";

    tocarSom();

    if (estrelas === 10) {

        setTimeout(function () {

            irParaProximaFase();

        }, 700);
    }
}


// ======================================
// PRÓXIMA FASE
// ======================================

function irParaProximaFase() {

    faseAtual++;

    mostrarFase(faseAtual);

    atualizarProgresso();

}


// ======================================
// FASE 2 - BALÕES
// ======================================

function popGameBalloon(balloon) {

    if (balloon.classList.contains("popped")) {
        return;
    }

    balloon.classList.add("popped");

    baloes++;

    document.getElementById("balloonCount").innerHTML =
        "Balões estourados: " + baloes + "/5";

    tocarSom();

    if (baloes === 5) {

        setTimeout(function () {

            irParaProximaFase();

        }, 700);
    }
}


// ======================================
// FASE 3 - VELAS
// ======================================

function blowCandle() {

    const chamas = document.querySelectorAll(".flame");

    if (velas >= 3) {
        return;
    }

    chamas[velas].classList.add("off");

    velas++;

    document.getElementById("candleCount").innerHTML =
        "Velas apagadas: " + velas + "/3";

    tocarSom();

    if (velas === 3) {

        document.getElementById("cakeHint").innerHTML =
            "🎉 Você conseguiu! 🎉";

        setTimeout(function () {

            finalizarJogo();

        }, 1000);
    }
}


// ======================================
// FINALIZAR JOGO
// ======================================

function finalizarJogo() {

    faseAtual = 4;

    atualizarProgresso();

    telaFinal.classList.add("show");

    tocarSomVitoria();

    iniciarConfetes();


    // TENTAR INICIAR A MÚSICA AUTOMATICAMENTE

    const musica = document.getElementById("birthdayMusic");

    if (musica) {

        musica.play().catch(function () {

            console.log(
                "O navegador bloqueou o autoplay. Clique em Tocar música."
            );

        });

    }
}


// ======================================
// TOCAR MÚSICA
// ======================================

function tocarMusica() {

    const musica = document.getElementById("birthdayMusic");

    if (musica) {

        musica.play();

    }
}


// ======================================
// FECHAR TELA FINAL
// ======================================

function closeFinal() {

    telaFinal.classList.remove("show");

    const musica = document.getElementById("birthdayMusic");

    if (musica) {

        musica.pause();

        musica.currentTime = 0;

    }
}


// ======================================
// SOM DOS CLIQUES
// ======================================

function tocarSom() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    const audio = new AudioContext();

    const oscilador = audio.createOscillator();

    const ganho = audio.createGain();

    oscilador.connect(ganho);

    ganho.connect(audio.destination);

    oscilador.frequency.value = 600;

    ganho.gain.setValueAtTime(
        0.1,
        audio.currentTime
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.15
    );

    oscilador.start();

    oscilador.stop(
        audio.currentTime + 0.15
    );
}


// ======================================
// SOM DE VITÓRIA
// ======================================

function tocarSomVitoria() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext) {
        return;
    }

    const audio = new AudioContext();

    const notas = [
        523,
        659,
        784,
        1046
    ];

    notas.forEach(function (frequencia, indice) {

        const oscilador =
            audio.createOscillator();

        const ganho =
            audio.createGain();

        oscilador.connect(ganho);

        ganho.connect(audio.destination);

        oscilador.frequency.value =
            frequencia;

        const inicio =
            audio.currentTime +
            indice * 0.15;

        ganho.gain.setValueAtTime(
            0.1,
            inicio
        );

        ganho.gain.exponentialRampToValueAtTime(
            0.001,
            inicio + 0.3
        );

        oscilador.start(inicio);

        oscilador.stop(
            inicio + 0.3
        );

    });
}


// ======================================
// CONFETES
// ======================================

function iniciarConfetes() {

    const canvas =
        document.getElementById("confetti");

    const ctx =
        canvas.getContext("2d");

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    const confetes = [];

    for (let i = 0; i < 150; i++) {

        confetes.push({

            x: Math.random() * canvas.width,

            y:
                Math.random() *
                canvas.height -
                canvas.height,

            tamanho:
                Math.random() * 8 + 4,

            velocidade:
                Math.random() * 4 + 2,

            rotacao:
                Math.random() * 360

        });
    }


    function desenhar() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        confetes.forEach(function (confete) {

            ctx.save();

            ctx.translate(
                confete.x,
                confete.y
            );

            ctx.rotate(
                confete.rotacao
            );

            ctx.fillStyle =
                "hsl(" +
                Math.random() * 360 +
                ", 100%, 60%)";

            ctx.fillRect(
                0,
                0,
                confete.tamanho,
                confete.tamanho
            );

            ctx.restore();

            confete.y +=
                confete.velocidade;

            confete.rotacao += 0.05;

            if (confete.y > canvas.height) {

                confete.y = -10;

            }

        });

        requestAnimationFrame(desenhar);
    }

    desenhar();
}


// ======================================
// ESC FECHA A TELA FINAL
// ======================================

document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {

        closeFinal();

    }

});
