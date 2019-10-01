<script>
  export let text;
  export let number;
  export let action;
  export let status;
  export let handleMiddleButtonClick = (number, text) => {
    if (!status) {
      return;
    }
    console.log(Number(number), text);
    let bu = "./sounds/";
    let audio = new Audio();
    switch (Number(number)) {
      case 1: {
        audio.src = bu + "do.wav";
        break;
      }
      case 2: {
        audio.src = bu + "re.wav";
        break;
      }
      case 3: {
        audio.src = bu + "mi.wav";
        break;
      }
      case 4: {
        audio.src = bu + "fa.wav";
        break;
      }
      case 5: {
        audio.src = bu + "sol.wav";
        break;
      }
      case 6: {
        audio.src = bu + "la.wav";
        break;
      }
      case 7: {
        audio.src = bu + "si.wav";
        break;
      }
      case 8: {
        audio.src = bu + "do-m.wav";
        break;
      }
      case 9: {
        audio.src = bu + "sol.wav";
        break;
      }
      default: {
        audio.src = bu + "sol.wav";
        break;
      }
    }
    console.log(audio);
    audio.play();
    action && action(number);
  };
</script>

<style>
  .middle-button {
    height: 8vh;
    width: 8vh;
    background: linear-gradient(180deg, #fff 50%, #9f2824 50%);

    border-radius: 1vh;
    border: none;

    text-transform: uppercase;
    box-sizing: border-box;

    font-size: 2vh;
    line-height: 3vh;
    font-weight: bold;
    text-align: center;

    box-shadow: -3px -3px 2px #2d343e;
  }
  .middle-button span {
    display: inline-block;
    width: 100%;
    height: 50%;
  }

  .middle-button .number {
    font-size: 3vh;
    line-height: 3vh;
    color: #315e99;
  }
  .middle-button .tone {
    color: #fff;
  }
</style>

<button
  class="middle-button"
  on:click={() => handleMiddleButtonClick(number, text)}>
  <span class="number">{number}</span>
  <span class="tone">{text}</span>
</button>
