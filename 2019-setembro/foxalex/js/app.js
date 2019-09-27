/**
 * Buttons
 */

function initButtons() {
  // Main Buttons
  const mainButtons = document.querySelectorAll('.main-buttons-wrap button');
  mainButtons.forEach(button => {
    button.addEventListener('click', () =>
      PB_buttonPress(button.innerText.toUpperCase())
    );
  });
  // End Main Buttons

  // System Buttons
  const systemButtons = document.querySelectorAll(
    '.buttons-wrap.system button'
  );
  systemButtons.forEach(button => {
    button.addEventListener('click', () =>
      PB_buttonPress(button.innerText.replace('.', '').toUpperCase())
    );
  });
  // End System Buttons

  // Math Numbers
  const mathButtons = document.querySelectorAll('.buttons-wrap.math button');
  mathButtons.forEach(button => {
    button.addEventListener('click', () =>
      PB_buttonPress(button.getAttribute('data-signal'))
    );
  });

  // Numbers Buttons
  const numbersButtons = document.querySelectorAll(
    '.buttons-wrap.numbers button'
  );
  numbersButtons.forEach(button => {
    const number = button.querySelector('span').innerText;
    button.addEventListener('click', () => PB_buttonPress(number));
  });
  // End Numbers

  // Games Buttons
  const gamesButtons = document.querySelectorAll('.buttons-wrap.games button');
  gamesButtons.forEach(button => {
    const action = button.getAttribute('data-game');
    button.addEventListener('click', () => PB_buttonPress(action));
  });
  // End Games Buttons
}

/**
 * Overlay Welcome
 */
const overlay = document.querySelector('.overlay');
const btnWelcome = document.querySelector('.overlay button');
// Add Event - Click
btnWelcome.addEventListener('click', () => {
  overlay.classList.add('hidden');
  window.localStorage.setItem('first', true);
});
// End Overlay

/**
 * Init
 */
function init() {
  // Check and Show Overlay
  const check = window.localStorage.getItem('first');
  if (check === null) {
    overlay.classList.remove('hidden');
  }

  // Init Buttons
  initButtons();

  // Init Pensebem.js
  PB_init();
}

// Init App
window.addEventListener('load', init);
