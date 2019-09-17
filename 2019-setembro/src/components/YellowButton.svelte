<script>
  export let YellowButton;
  export let text;
</script>

<style>
  .yellow-button {
    background-color: #f7cf3c;
    color: #315e99;
    height: 8vh;
    width: 8vh;

    border-radius: 1vh;
    border: none;

    text-transform: uppercase;
    box-sizing: border-box;

    font-size: 1.3vh;
    text-align: center;
    word-wrap: break-word;

    box-shadow: -3px -3px 2px #2d343e;
  }
</style>

<button class="yellow-button">{text}</button>
