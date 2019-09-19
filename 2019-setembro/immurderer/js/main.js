function press(e) {
  if (lcd_isOn) {
    click_sound.play();
    let value = e.target.innerHTML;
    switch (value) {
      case "ADIÇÃO":
        operacao("+");
        handleEnter();
        break;
      case "SUBTRAÇÃO":
        operacao("-");
        handleEnter();
        break;
      case "MULTIPLICAÇÃO":
        operacao("*");
        handleEnter();
        break;
      case "DIVISÃO":
        operacao("/");
        handleEnter();
        break;
      case "ARITMÉTICA":
        operacao();
        handleEnter();
        break;
      case "OPERAÇÃO":
        gameOperacao();
        handleEnter();
        break;
      case "NÚMERO DO MEIO":
        numeroDoMeio();
        handleEnter();
        break;
      case "ADIVINHE O NUMERO":
        adivinheONumero();
        handleEnter();
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
