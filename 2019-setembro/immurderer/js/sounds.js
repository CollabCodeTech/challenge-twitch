let turn_on_sound = new sound("./js/sounds/turn_on.wav");
let turn_off_sound = new sound("./js/sounds/turn_off.wav");
let click_sound = new sound("./js/sounds/click.wav");
let success_sound = new sound("./js/sounds/success.wav");
let fail_sound = new sound("./js/sounds/fail.wav");

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
