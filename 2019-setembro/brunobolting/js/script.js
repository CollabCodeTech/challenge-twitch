window.onload = function script() {
  let buttons = document.querySelectorAll("button.btn");
  let on = document.querySelector("button.btn.-on");
  let off = document.querySelector("button.btn.-off");
  let enter = document.querySelector("button.btn.-enter");
  let display = document.getElementById("display");
  let clearDisplay = true;

  on.addEventListener("click", event => {
    if (event.target.classList.contains("grey-scale") == false) {
      playSound(event);
    }
    display.innerHTML = "Hello";
    turnOn(buttons);
    addEvent(buttons);
  });

  off.addEventListener("click", () => {
    display.innerHTML = "0";
    turnOff(buttons);
    removeEvent(buttons);
  });

  enter.addEventListener("click", () => {
    let oper = display.innerHTML;
    display.innerHTML = eval(oper);
    clearDisplay = true;
  });

  function addEvent(buttons) {
    buttons.forEach(element => {
      if (element.hasAttribute("sound") && element.classList.contains("grey-scale") == false) {
        element.addEventListener("click", playSound);
      }
      if (element.hasAttribute("music") && element.classList.contains("grey-scale") == false) {
        element.addEventListener("click", playMusic);
      }
      if (
        (element.classList.contains("num") || element.classList.contains("operators")) &&
        element.classList.contains("grey-scale") == false
      ) {
        element.addEventListener("click", writeDisplay);
      }
    });
  }

  function removeEvent(buttons) {
    buttons.forEach(element => {
      if (element.hasAttribute("sound")) {
        element.removeEventListener("click", playSound);
      }
      if (element.hasAttribute("music")) {
        element.removeEventListener("click", playMusic);
      }
    });
  }

  function playSound(event) {
    let sound = event.target.attributes.sound.value;
    let audio = new Audio(`assets/sounds/${sound}`);
    audio.volume = 1;
    audio.play();

    if (clearDisplay) {
      display.innerHTML = "";
      clearDisplay = false;
    }
  }

  function playMusic(event) {
    let sound = event.target.attributes.music.value;
    if (document.getElementById("audio")) {
      document.getElementById("audio").remove();
    } else {
      let audio = document.createElement("audio");
      audio.id = "audio";
      audio.src = `assets/sounds/${sound}`;
      audio.style.display = "none";
      // audio.autoplay = false;
      audio.onended = function() {
        audio.remove(); //remove after playing to clean the Dom
      };
      document.body.appendChild(audio);
      audio.volume = 0.1;
      audio.paused ? audio.play() : audio.pause();
    }
  }

  function turnOn(buttons) {
    buttons.forEach(elem => {
      if (elem.classList.contains("-on")) {
        elem.classList.add("grey-scale");
      } else {
        elem.classList.remove("grey-scale");
      }
    });
    display.classList.remove("grey-scale");
    display.innerHTML = "Hello";
    clearDisplay = true;
  }

  function turnOff(buttons) {
    buttons.forEach(elem => {
      if (elem.classList.contains("-on")) {
        elem.classList.remove("grey-scale");
      } else {
        elem.classList.add("grey-scale");
      }
    });
    display.classList.add("grey-scale");
    display.innerHTML = "0";
  }

  function writeDisplay(event) {
    if (clearDisplay) {
      display.innerHTML = "";
      clearDisplay = false;
    }
    display.innerHTML += event.target.attributes.value.value;
  }
};
