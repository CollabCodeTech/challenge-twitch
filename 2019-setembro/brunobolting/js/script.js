window.onload = function script() {
  let buttons = document.querySelectorAll("button.btn");
  let on = document.querySelector("button.btn.-on");
  let off = document.querySelector("button.btn.-off");
  let display = document.getElementById("display");

  on.addEventListener("click", () => {
    turnOn(buttons);
    addEventSound(buttons);
  });
  off.addEventListener("click", () => {
    turnOff(buttons);
    removeEventSound(buttons);
  });

  function addEventSound(buttons) {
    buttons.forEach(element => {
      if (element.hasAttribute("sound")) {
        element.addEventListener("click", playSound);
      }
      if (element.hasAttribute("music")) {
        element.addEventListener("click", event => {
          let sound = event.target.attributes.music.value;
          if (document.getElementById("audio")) {
            document.getElementById("audio").remove();
          } else {
            let audio = document.createElement("audio");
            audio.id = "sounds";
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
        });
      }
    });
  }

  function removeEventSound(buttons) {
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
  }

  function playMusic(event) {
    let sound = event.target.attributes.music.value;
    if (document.getElementById("audio")) {
      document.getElementById("audio").remove();
    } else {
      let audio = document.createElement("audio");
      audio.id = "sounds";
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
};
