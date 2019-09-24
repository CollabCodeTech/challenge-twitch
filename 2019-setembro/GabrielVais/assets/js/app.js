const btnLigar = document.querySelector("#btnLigar");

const btnDesligar = document.querySelector("#btnDesligar");

const btnLimpar = document.querySelector("#btnLimpar");

const display = document.querySelector(".tela-content");

const output = document.querySelector("#output");

const players = [];


btnLigar.addEventListener('click', function(){

if(display.classList.contains("desligado") || display.classList.contains("animation")){

	display.classList.remove("desligado");

	display.classList.remove("animation");

	display.classList.add("ligado");

	getAudio("./assets/sounds/button-3.mp3");


	}


});

btnPause = document.querySelector("#btnPause");

btnPause.addEventListener('click', function(){



});



btnDesligar.addEventListener('click', function(){

	if(display.classList.contains("ligado")){

	display.classList.remove("ligado");

	getAudio("./assets/sounds/button-2.mp3");

	display.classList.add("animation");




	}

});
	
var buttons = document.querySelectorAll('.button');

var action = null;
var current = 0;

var actions = {
  '/': ' / ',
  'x': ' * ',
  '-': ' - ',
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

        getAudio("./assets/sounds/button-38.mp3");

      
      }else if(input.length >= 2){

       	e.preventDefault();
        console.log("clique em um numero caso queira usar a calculadora");

      }else{
        if (action && action !== '=') {

          var calculation = current + actions[action] + parseInt(output.innerText);

          if(isNaN(calculation)){

          	  output.innerText = 0;

          }
          console.log('calculate', calculation);
          output.innerText = eval(calculation).toFixed(0);   	
        }

       getAudio("./assets/sounds/beep-23.mp3");

        current = parseInt(output.innerText);
        action = input;
      }
    } else {

      getAudio("./assets/sounds/click.mp3");

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

 function PlaySound(melody) {
        alert("On Press of "+melody);
        var path = "path\\to\\melody\\"
        var snd = new Audio(path + melody + ".wav");
       	snd.play();
}
btnsAll = document.querySelectorAll(".btn-medium-numbers");

var audio = '';

var pause = false;

btnsAll.forEach(btn =>{

	btn.addEventListener('click', function(e){

		let input = e.target.innerText;

		if(display.classList.contains("ligado")){

			switch(input) {
			  
			  case 'Pausa':

			  	  if(pause){

			  	  	pause = false;

			  	  }else{

			  	  	pause = true;
			  	  }

			    break;
			 case 'DÓ':
			    	getAudio("./assets/sounds/do.wav");
			    break;
			 case 'RÉ':
			    	getAudio("./assets/sounds/re.wav");
			    break;
			 case 'MI':
			    	getAudio("./assets/sounds/mi.wav");
			    break;
			 case 'FÁ':
			    	getAudio("./assets/sounds/fa.wav");
			    break;
			 case 'FÁ':
			    	getAudio("./assets/sounds/sol.wav");
			    break;
			 case 'SOL':
			    	getAudio("./assets/sounds/la.wav");
			    break;
			 case 'LÁ':
			    	getAudio("./assets/sounds/si.wav");
			    break;
			 case 'SI':
			    	getAudio("./assets/sounds/do-stretched.wav");
			    break;
			 case 'DÒ':
			    	getAudio("./assets/sounds/re-stretched.wav");
			    break;
			 case 'RÈ':
			    	getAudio("./assets/sounds/do.wav");
			    break;
			  default:console.log('Botao invalido');
			}

		}

	});

});


function getAudio(src){

	if(pause === false){

		audio = new Audio(src);

		audio.play();

	}
}
