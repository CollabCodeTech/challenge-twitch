let turn_on_sound = new sound("./js/sounds/turn_on.wav");
let turn_off_sound = new sound("./js/sounds/turn_off.wav");
let click_sound = new sound("./js/sounds/click.wav");
let success_sound = new sound("./js/sounds/success.wav");
let fail_sound = new sound("./js/sounds/fail.wav");

let pianoSounds = {
  DO: new sound("./js/sounds/piano_notes/do.mp3"),
  RÉ: new sound("./js/sounds/piano_notes/re.mp3"),
  MI: new sound("./js/sounds/piano_notes/mi.mp3"),
  FÁ: new sound("./js/sounds/piano_notes/fa.mp3"),
  SOL: new sound("./js/sounds/piano_notes/sol.mp3"),
  LÁ: new sound("./js/sounds/piano_notes/la.mp3"),
  SI: new sound("./js/sounds/piano_notes/si.mp3"),
  DÒ: new sound("./js/sounds/piano_notes/do8.mp3"),
  RÈ: new sound("./js/sounds/piano_notes/re.mp3")
};

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
