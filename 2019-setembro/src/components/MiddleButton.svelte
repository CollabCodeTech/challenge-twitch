<script>
  export let text;
  export let number;
  export let handleMiddleButtonClick = (number, text) => {
    console.log(number, text);
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
