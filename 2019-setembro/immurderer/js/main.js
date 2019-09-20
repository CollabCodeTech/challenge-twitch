function press(e) {
  if (lcd_isOn) {
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
      case "POKEMON":
        pokemon();
        handleEnter();
        break;
      case "ENTER":
        handleEnter();
        break;
    }
    if (canEval) {
      if (!isNaN(value) || value.match(/(\+|\*|\-|\/|🔥|⚡|💧|🍃)/)) {
        lcd.innerHTML += value;
      }
    }
    if (value.match(/^(DO|RÉ|MI|FÁ|SOL|LÁ|SI|DÒ|RÈ)/)) {
      pianoSounds[value].play();
    } else {
      click_sound.play();
    }
  }
}

buttons = document.querySelectorAll(".btn, .btn-lg");
for (let i = 0; i < buttons.length; i++) {
  if (buttons[i].innerHTML == "LIGA") continue;
  buttons[i].addEventListener("click", press);
}
