const $display = document.querySelector('.display p');
const $allButtons = document.querySelectorAll('button');
const $pianoAudios = document.querySelectorAll('.piano-notes');
const $othersAudios = document.querySelector('.others');
const $onoff = document.querySelectorAll('.onoff');
const $enter = document.querySelector('.enter');

document.querySelectorAll('audio').forEach(audio => {
  audio.volume = 0.2;
});

const sounds = {
  turOn: '../assets/sounds/others_sounds/on.mp3',
  click: '../assets/sounds/others_sounds/click.mp3',
}

let anyGameState = false;
let currentGame = '';
let music = [];
let playingMusic = false;

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

const activateGame = (game) => {
  deactivateGames();
  if (currentGame === game) {
    currentGame = '';
    setToDisplay('000000');
    console.log(`${game}:`, state[game]);
    return;
  }
  setToDisplay(game);
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

let time = 300;

const saveNotes = (note) => {
  if (note == 0) time = 600;
  if (note != 0) {
    music[music.length] = [note, time];
    console.log(music);
    time = 300;
  }
}

const playMusic = async (musicNotes) => {
  for (let i = 0; i < musicNotes.length; i++) {
    await sleep(musicNotes[i][1] - 50);
    playPiano(musicNotes[i][0], true);
  }
  playingMusic = false;
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

    if (state.toy 
    && button.innerHTML.match(/[0-9]/)
    && (state.piano || state.memoriaDeTons)) {
      playPiano(button.innerHTML);
      return;
    }

    if (!anyGameState && state.toy) playSound();

    if (games.includes(button.dataset.game)) {
      activateGame(button.dataset.game);
    } 
  });
});

