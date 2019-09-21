const btnLigar = document.querySelector("#btnLigar");

const btnDesligar = document.querySelector("#btnDesligar");

const btnLimpar = document.querySelector("#btnLimpar");

const display = document.querySelector(".tela-content");

const output = document.querySelector("#output");

const players = [];


btnLigar.addEventListener('click', async function(){

if(display.classList.contains("desligado") || display.classList.contains("animation")){

	display.classList.remove("desligado");

	display.classList.remove("animation");

	display.classList.add("ligado");

	const sounds = await getSounds();
 	 
 	addSoundsToPage(sounds);

	}


});

btnPause = document.querySelector("#btnPause");

btnPause.addEventListener('click', stopAll);



btnDesligar.addEventListener('click', function(){

	if(display.classList.contains("ligado")){

	display.classList.remove("ligado");

	display.classList.add("animation");

	stopAll();

	}

});
	
var buttons = document.querySelectorAll('.button');

var action = null;
var current = 0;

var actions = {
  '÷': ' / ',
  'x': ' * ',
  '−': ' - ',
  '+': ' + ',
  '=': '=',
};

for (button in buttons) {
  buttons[button].onclick = function (e) {

  	if(display.classList.contains("ligado")){

    var input = e.target.innerText;
    var num = parseInt(input);
    if (isNaN(num)) {
      if (input == 'Limpar') {
        console.log('clear');
        action = null;
        current = 0;
        output.innerText = 0;
      } else {
        if (action && action !== '=') {

          var calculation = current + actions[action] + output.innerText;
          console.log('calculate', calculation);
          output.innerText = eval(calculation);   	
        }
        current = parseInt(output.innerText);
        action = input;
      }
    } else {
      if (current === parseInt(output.innerText)) {
        output.innerText = num;
      } else {
        output.innerText += num;
      }
    }
    console.log({
      action: action,
      current: current,
      input: input,
    });
  };
}

}

function addSoundsToPage(sounds) {

  sounds.forEach(addSoundToPage);
  console.log(sounds);
}



function soundPress(element, player) {

  player.currentTime = 0;
  player.play();
}


async function getSounds() {
  const response = await fetch('../sounds.json');
  const json = await response.json();
  return json;
}

function addSoundToPage(sound) {

  var buttonNumbers = document.querySelectorAll(".btn-medium-numbers");

  buttonNumbers.forEach(buttonNumber=>{
 
  const player = document.createElement('audio');
  player.setAttribute('src', `${sound.src}`)
  buttonNumber.appendChild(player);
  players.push({ player, buttonNumber });

  buttonNumber.addEventListener('mouseover', function(){
    soundPress(buttonNumbers, player);
  		
  		});

	});

}




function stopAll() {
  players.forEach(({player}) => {
    player.pause();
  });
}

