<script>
  export let key;
  export let color;
  export let status;
  export const handleBigButtonClick = letter => {
    if (!status) {
      return;
    }
    console.log(letter);
    let audio = new Audio();
    audio.src = "./sounds/click.wav";
    audio.play();
  };
</script>

<style>
  .big-button {
    display: inline-block;
    box-sizing: border-box;
    height: 18vh;
    width: 5vw;

    border: none;
    border-radius: 1vw;
    box-shadow: -3px -3px 2px #2d343e;

    transform: skew(-20deg);
  }

  .big-button > .text {
    display: inline-block;
    transform: skew(20deg);

    color: #fff;
    font-size: 2.5vh;
    font-weight: bold;
  }

  .big-button.-red {
    background-color: #9f2824;
  }

  .big-button.-yellow {
    background-color: #f7cf3c;
  }

  .big-button.-blue {
    background-color: #1a4379;
  }

  .big-button.-green {
    background-color: #3db460;
  }
</style>

<button
  class="big-button -{color}"
  type="submit"
  on:click={() => handleBigButtonClick(key)}>
  <span class="text">{key}</span>
</button>
