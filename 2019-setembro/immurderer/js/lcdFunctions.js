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
    lcd_isOn = false;
    mostraProx = true;
    questoes = [];
    i = 0;
    pontuacao = 0;
  }
}
