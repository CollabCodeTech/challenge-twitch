<script>
  export let MiddleButton;
  export let text;
  export let number;
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
    color: #9f2824;
  }
  .middle-button .tone {
    color: #fff;
  }
</style>

<button class="middle-button">
  <span class="number">{number}</span>
  <span class="tone">{text}</span>
</button>
