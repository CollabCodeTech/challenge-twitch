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
let i = 0;

let enterPressed = false;
const lcd = document.getElementById("lcd");

function show(str, animate = false) {
  lcd.innerHTML = "";
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
    show("HELLO", true);
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
    questoes = [];
    mostraProx = true;
    i = 0;
    lcd_isOn = false;
  }
}

function handleSuccess(condicao, mensagem) {
  if (condicao) {
    success_sound.play();
    pontuacao += 10;
    show("PARABENS");
  } else {
    fail_sound.play();
    pontuacao -= 5;
    show(mensagem, true);
  }
}

function operacao(operador = null) {
  for (let i = 0; i < 2; i++) {
    let b = Math.floor(Math.random() * maxNumber) + 1;
    let a = Math.floor(Math.random() * maxNumber) + (operador == "/" ? b : 1);
    operador =
      operador == null ? "+-/*"[Math.floor(Math.random() * 4)] : operador;
    conta = `${a}${operador}${b}`;
    questoes.push({ conta, res: eval(conta) });
  }
}

function handleEnter() {
  console.log(i);
  if (i < questoes.length) {
    // Se não for pra mostrar
    if (!mostraProx) {
      // Pega o resultado do lcd
      res = /=[+|-]*\d*/.exec(lcd.innerHTML)[0].slice(1) || 0;
      // Verifica se o resultado esta correto
      handleSuccess(
        questoes[i].res == res,
        `${questoes[i].conta}=${questoes[i].res}`
      );
      // Proibe digitar
      canEval = false;
      // Permite mostrar o proximo
      mostraProx = true;
      i++;
    } else {
      // Mostra a conta
      show(questoes[i].conta + "=");
      // Permite digitar
      canEval = true;
      // Impede o display de outra conta
      mostraProx = false;
    }
  } else {
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
