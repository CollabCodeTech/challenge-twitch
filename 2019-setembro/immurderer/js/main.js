let turn_on_sound = new sound("./js/sounds/turn_on.wav");
let turn_off_sound = new sound("./js/sounds/turn_off.wav");
let click_sound = new sound("./js/sounds/click.wav");
let success_sound = new sound("./js/sounds/success.wav");
let fail_sound = new sound("./js/sounds/fail.wav");

let lcd_isOn = false;
let canEval = false;
let maxNumber = 10;
let questoes = [];
let mostraProx = true;
let pontuacao = 0;
let maxQuestions = 2;
let i = 0;

let enterPressed = false;
const lcd = document.getElementById("lcd");

function show(str, animate = false) {
  lcd.innerHTML = "";
  if (str.length > 10) {
    lcd.parentElement.classList.add("marquee");
  } else {
    lcd.parentElement.classList.remove("marquee");
  }
  let i = 0;
  function type() {
    if (i < str.length) {
      lcd.innerHTML += str.charAt(i);
      i++;
      setTimeout(type, 150);
    }
  }
  if (animate) {
    type();
    return;
  }
  lcd.innerHTML = str;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}

function on() {
  if (!lcd_isOn) {
    show("HELLOPPPP", true);
    turn_on_sound.play();
    lcd_isOn = true;
  }
}
function off() {
  if (lcd_isOn) {
    show("");
    turn_off_sound.play();
    canEval = false;
    enterPressed = false;
    lcd_isOn = false;
    mostraProx = true;
    questoes = [];
    i = 0;
    pontuacao = 0;
  }
}

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

function operacao(operador = null) {
  for (let i = 0; i < maxQuestions; i++) {
    let b = Math.floor(Math.random() * maxNumber) + 1;
    let a = Math.floor(Math.random() * maxNumber) + (operador == "/" ? b : 1);
    operador =
      operador == null ? "+-/*"[Math.floor(Math.random() * 4)] : operador;
    conta = `${a}${operador}${b} = `;
    questoes.push({ conta, res: eval(conta) });
  }
}

function gameOperacao() {
  for (let i = 0; i < maxQuestions; i++) {
    let b = Math.floor(Math.random() * maxNumber) + 1;
    let a = Math.floor(Math.random() * maxNumber) + 1;
    operador = "+-/*"[Math.floor(Math.random() * 4)];
    resultado = eval(`${a}${operador}${b}`);
    conta = `${a}_${b}=${resultado} | `;
    res = operador;
    questoes.push({ conta, res });
  }
}

function numeroDoMeio() {
  /*
    Gera 10 pares de numeros aleatorios
    Pega a média inteira dos pares
    Adiciona às questoes um objeto com os pares e a média
  */
  for (let i = 0; i < maxQuestions; i++) {
    let a = Math.floor(Math.random() * 100) + 1;
    let b = Math.floor(Math.random() * 100) + 1;
    let media = Math.floor((a + b) / 2);
    conta = `${a}~_~${b} | `;
    questoes.push({ conta, res: media });
  }
}
function adivinheONumero() {
  let num = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < maxQuestions; i++) {
    questoes.push(num);
  }
}

function handleEnter() {
  if (i < questoes.length) {
    // Se não for pra mostrar
    if (!mostraProx) {
      // Pega o resultado do lcd
      if (lcd.innerHTML.match(/\d(\+|\-|\*|\/)\d/)) {
        res = /=[+|-]*\d*/.exec(lcd.innerHTML)[0].slice(1) || 0;
        // Verifica se o resultado esta correto
        handleSuccess(
          questoes[i].res == res,
          `${questoes[i].conta}=${questoes[i].res}`
        );
        // Proibe digitar
        canEval = false;
      } else if (lcd.innerHTML.indexOf("~") >= 1) {
        res = lcd.innerHTML.match(/\| \d{1,2}/)[0].slice(1);
        handleSuccess(
          questoes[i].res == res,
          questoes[i].conta.replace("_", questoes[i].res)
        );
      } else if (lcd.innerHTML.indexOf("Adivinhe") >= 0) {
        res = lcd.innerHTML.match(/\| \d{1,2}/)[0].slice(1);
        msg =
          i + 1 >= questoes.length
            ? "Correto: " + questoes[i]
            : "X Adivinhe | ";
        handleSuccess(questoes[i] == res, msg);
        i++;
        return;
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

function press(e) {
  if (lcd_isOn) {
    click_sound.play();
    let value = e.target.innerHTML;
    switch (value) {
      case "ADIÇÃO":
        operacao("+");
        break;
      case "SUBTRAÇÃO":
        operacao("-");
        break;
      case "MULTIPLICAÇÃO":
        operacao("*");
        break;
      case "DIVISÃO":
        operacao("/");
        break;
      case "ARITMÉTICA":
        operacao();
        break;
      case "OPERAÇÃO":
        gameOperacao();
        break;
      case "NÚMERO DO MEIO":
        numeroDoMeio();
        break;
      case "ADIVINHE O NUMERO":
        adivinheONumero();
        break;
      case "ENTER":
        handleEnter();
        break;
    }
    if (canEval) {
      if (!isNaN(value) || value.match(/(\+|\*|\-|\/)/)) lcd.innerHTML += value;
    }
  }
}

buttons = document.querySelectorAll(".btn, .btn-lg");
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].innerHTML == "LIGA") continue;
  buttons[i].addEventListener("click", press);
}
