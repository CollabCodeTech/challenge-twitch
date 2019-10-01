<script>
  export let text;
  export let color;
  export let fontColor;
  export let action;
  export let status;

  export const handleFunctionalButtonClick = text => {
    if (text !== "liga" && text !== "desl.") {
      if (!status) {
        return;
      }
    }
    console.log(text);
    let audio = new Audio();
    audio.src = "./sounds/click.wav";
    audio.play();
    if (text !== "liga" && text !== "desl.") {
      console.log("action: ", text);
      action && action(text);
    } else {
      action && action();
    }
  };
</script>

<style>
  .functional-button {
    height: 8vh;
    width: 8vh;

    border-radius: 1vh;
    border: none;

    text-transform: uppercase;
    box-sizing: border-box;

    font-size: 2vh;
    font-weight: bold;
    text-align: center;

    box-shadow: -3px -3px 2px #2d343e;
  }

  .functional-button.-white {
    background-color: #fff;
  }

  .functional-button.-red {
    background-color: #b0252a;
  }

  .functional-button.-blue {
    background-color: #315e99;
  }

  .functional-button.-green {
    background-color: #379b52;
  }

  .functional-button.-font-blue {
    color: #315e99;
  }

  .functional-button.-font-white {
    color: #fff;
  }
</style>

<button
  class="functional-button -{color} -font-{fontColor}"
  on:click={() => handleFunctionalButtonClick(text)}>
  {text}
</button>
