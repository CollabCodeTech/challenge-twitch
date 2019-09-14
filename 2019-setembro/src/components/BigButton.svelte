<script>
  export let BigButton = "";
  export let key;
  export let color;
</script>

<style>
  .big-button {
    display: inline-block;
    height: 20vh;
    width: 5vw;

    border: none;
    border-radius: 1vw;

    transform: skew(-20deg);
  }

  .big-button > .text {
    display: inline-block;
    transform: skew(20deg);

    color: #fff;
    font-size: 3vh;
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

<button class="big-button -{color}">
  <span class="text">{key}</span>
</button>
