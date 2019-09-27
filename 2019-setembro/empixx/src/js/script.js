const $display = document.querySelector('.display p');
const $allButtons = document.querySelectorAll('button');
const $pianoAudios = document.querySelectorAll('.piano-notes');
const $othersAudios = document.querySelector('.others');
const $onoff = document.querySelectorAll('.onoff');
const $enter = document.querySelector('.enter');
const $numbersNotesButtons = document.querySelectorAll('.numbers-notes button');

// document.querySelectorAll('audio').forEach(audio => {
//   audio.volume = 0.8;
// });

const sounds = {
  turOn: '../assets/sounds/others_sounds/on.mp3',
  click: '../assets/sounds/others_sounds/click.mp3',
  lose: '../assets/sounds/others_sounds/lose.mp3',
}

let anyGameState = false;
let currentGame = '';
let music = [];
let playingMusic = false;
let time = 300;
let sigameNotes = [];
let playerTurn = false;
let playerNotes = [];
let score = 0;
let operation = '';

const operations = ['+', '-', '*', '/'];

const state = {
  toy: false,
  adicao: false,
  subtracao: false,
  multiplicacao: false,
  divisao: false,
  aritmetica: false,
  operacao: false,
  sigaMe: false,
  memoriaDeTons: false,
  numeroDoMeio: false,
  adivinheONumero: false,
  piano: false,
}

const games = Object.entries(state).map(game => { return game[0] });

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const setToDisplay = (value) => {
  $display.innerHTML = value;
}

const activateGame = async (game) => {
  deactivateGames();
  if (currentGame === game) {
    currentGame = '';
    setToDisplay('000000');
    console.log(`${game}:`, state[game]);
    return;
  }

  setToDisplay(game);
  await sleep(1500);

  if (game === 'sigaMe') sigaMe();
  if (game === 'operacao') operacao();

  currentGame = game;
  state[game] = true;
  console.log(`${game}:`, state[game]);
}

const deactivateGames = () => {
  games.forEach(game => {
    if (game != 'toy') {
      state[game] = false;
      console.log('All games:', false);
    } 
  });
}

const playSound = () => {
  $othersAudios.pause();
  $othersAudios.currentTime = 0;
  $othersAudios.play();
}

const playPiano = (note, playing = false) => {
  console.log('Note played:', note);
  setToDisplay(note);
  if (note != 0) {
    $pianoAudios[note - 1].pause();
    $pianoAudios[note - 1].currentTime = 0;
    $pianoAudios[note - 1].play();
  }
  if (note == 0 && !playing) playSound();
  if (state.memoriaDeTons && !playing) {
    saveNotes(note);
  }
}

const saveNotes = (note) => {
  if (note == 0) time = 600;
  if (note != 0) {
    music[music.length] = [note, time];
    time = 300;
  }
}

const playMusic = async (musicNotes) => {
  for (let i = 0; i < musicNotes.length; i++) {
    let note = musicNotes[i][0];
    let time = musicNotes[i][1] - 100;

    await sleep(time);
    await clickAnimation(note);
    playPiano(note, true);
  }
  playingMusic = false;
}

const clickAnimation = async (key) => {
  $numbersNotesButtons[key].classList.toggle('button-pressed');
  await sleep(100);
  $numbersNotesButtons[key].classList.toggle('button-pressed');
}

const sigaMe = () => {
  playerTurn = false;
  let randomNote = Math.floor(Math.random() * 9) + 1;
  sigameNotes.push([randomNote, 400]);
  playMusic(sigameNotes);
  playerTurn = true;
  playerNotes = [];
}

const sigaMePlayer = async (note) => {
  if (playerTurn && state.sigaMe) {
    playerNotes.push([note, 400]);
    let length = playerNotes.length - 1;
    if (!(playerNotes[length][0] 
       == sigameNotes[length][0])) {
        console.log('Player:', playerNotes[length][0]);
        console.log('Jogo:', sigameNotes[length][0]);
        await gameOver();
        return;
    }

    if (playerNotes.length == sigameNotes.length) {
      score += 100;
      setToDisplay(`Pontos: ${score}`);
      await sleep(500);
      sigaMe();
    }
  }
}

const operacao = () => {
  let calc = getRandomMath();
  if (calc[3] % 1 != 0 || calc[3] > 999) return getRandomMath(true);
  setToDisplay(`${calc[0]} ? ${calc[2]} = ${calc[3]}`);
  playerTurn = true;
  operation = calc[1];
  console.log(calc);
}

const operacaoPlayer = async (answer) => {
  if (playerTurn && state.operacao) {
    if (operation == answer) {
      console.log('yey \\o/');
      score += 100;
      setToDisplay(`Pontos: ${score}`);
      playerTurn = false;
      await sleep(500);
      operacao();
      return;
    }

    console.log('lose :(');
    await gameOver();
  }
}

const getRandomMath = (refresh = false) => {
  if (refresh) return operacao();

  let calc = [];
  calc.push(Math.floor(Math.random() * 99));
  calc.push(operations[Math.floor(Math.random() * 4)]);
  calc.push(Math.floor(Math.random() * 99));
  calc.push(eval(`${calc[0]} ${calc[1]} ${calc[2]}`));
  return calc;
}

const gameOver = async () => {
  setToDisplay(`Pontos: ${score}`);
  score = 0;
  playerTurn = false;
  sigameNotes = [];
  deactivateGames();
  $othersAudios.src = sounds.lose;
  playSound();
  await sleep(1000);
  $othersAudios.src = sounds.click;
}

$enter.addEventListener('click', () => {
  if (state.memoriaDeTons && !playingMusic) {
    playingMusic = true;
    playMusic(music);
    music = [];
    console.log('playing the music');
  }
});

$onoff.forEach(button => {
  button.addEventListener('click', async () => {
    if (button.innerHTML === 'LIGAR' && !state.toy) {
      playSound();
      await sleep(2000);
      state.toy = true;
      $othersAudios.src = sounds.click;
      $display.style.color = '#e74c3c';
      console.log('Toy:', state.toy);
      return;
    }
    
    if (button.innerHTML === 'DESLIGAR' && state.toy) {
      state.toy = false;
      currentGame = '';
      $othersAudios.src = sounds.turOn;
      $display.style.color = 'rgb(78, 80, 82)';
      deactivateGames();
      setToDisplay('000000');
      console.log('Toy:', state.toy);
    }
  });
});

$allButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!state.toy) return;

    if (button.innerHTML.match(/[0-9]/)
    && (state.piano || state.memoriaDeTons || state.sigaMe)
    && !playingMusic) {
      playPiano(button.innerHTML);
      if (state.sigaMe) sigaMePlayer(button.innerHTML);
      return;
    }

    if (state.operacao) operacaoPlayer(button.dataset.operation);

    if (!anyGameState && state.toy && !playingMusic) playSound();

    if (games.includes(button.dataset.game) && !playingMusic) {
      activateGame(button.dataset.game);
    } 
  });
});

