let lcd_isOn = false;
let canEval = false;
let maxNumber = 10;
let questoes = [];
let mostraProx = true;
let pontuacao = 0;
let maxQuestions = 10;
let i = 0;

const lcd = document.getElementById("lcd");

function handleSuccess(condicao, mensagem = "") {
  if (condicao) {
    success_sound.play();
    pontuacao += 10;
    console.log("Acertou");
    show("PARABENS");
  } else {
    fail_sound.play();
    pontuacao -= 5;
    show(mensagem);
  }
}
function handleEnter() {
  if (i < questoes.length) {
    // Se não for pra mostrar
    if (!mostraProx) {
      // Pega o resultado do lcd
      if (lcd.innerHTML.match(/\d(\+|\-|\*|\/)\d/)) {
        res = /(\+|-)?\d*$/.exec(lcd.innerHTML)[0] || 0;
        // Verifica se o resultado esta correto
        handleSuccess(
          questoes[i].res == res,
          `${questoes[i].conta}${questoes[i].res}`
        );
        // Proibe digitar
        canEval = false;
      } else if (lcd.innerHTML.indexOf("~") >= 1) {
        res = lcd.innerHTML.match(/\d*$/)[0].slice(1);
        handleSuccess(
          questoes[i].res == res,
          questoes[i].conta.replace("_", questoes[i].res)
        );
      } else if (lcd.innerHTML.indexOf("Adivinhe") >= 0) {
        res = lcd.innerHTML.match(/\d*$/)[0].slice(1);
        msg =
          i + 1 >= questoes.length
            ? "Correto: " + questoes[i]
            : "X Adivinhe | ";
        handleSuccess(questoes[i] == res, msg);
        i++;
        return;
      } else if (lcd.innerHTML.indexOf("🐱") >= 0) {
        res = lcd.innerHTML.match(/(🔥|⚡|💧|🍃)$/)[0] || 0;
        console.log(res);
        console.log(res == questoes[i].res);
        handleSuccess(
          questoes[i].res == res,
          questoes[i].conta + " = " + questoes[i].res
        );
      } else {
        res = lcd.innerHTML.slice(-1);
        // Mensagem de erro é conta com o underscore trocado
        handleSuccess(
          questoes[i].res == res,
          questoes[i].conta.replace("_", questoes[i].res)
        );
      }
      // Permite mostrar o proximo
      mostraProx = true;
      i++;
    } else {
      // Mostra a conta
      show(questoes[i].conta || "Adivinhe | ");
      // Permite digitar
      canEval = true;
      // Impede o display de outra conta
      mostraProx = false;
    }
  } else if (pontuacao > 0) {
    show("Pontos: " + pontuacao);
    pontuacao = 0;
  }
}
