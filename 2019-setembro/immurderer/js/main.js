let turn_on_sound = new sound("./js/sounds/turn_on.wav");
let turn_off_sound = new sound("./js/sounds/turn_off.wav");
let click_sound = new sound("./js/sounds/click.wav");
let success_sound = new sound("./js/sounds/success.wav");
let fail_sound = new sound("./js/sounds/fail.wav");

let lcd_isOn = false;
lcd = document.getElementById("lcd");
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
    lcd.innerHTML = "HELLO";
    turn_on_sound.play();
    lcd_isOn = true;
  }
  return;
}
function off() {
  if (lcd_isOn) {
    lcd.innerHTML = "";
    turn_off_sound.play();
    lcd_isOn = false;
  }
  return;
}

function press(e) {
  if (lcd_isOn) {
    click_sound.play();
    switch (e.target.innerHTML) {
      default:
        break;
    }
  }
}

buttons = document.querySelectorAll(".btn, .btn-lg");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", press);
}
