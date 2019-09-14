<script>
  import BigButton from "../components/BigButton.svelte";
  export let Keyboard;
</script>

<style>
  .keyboard-container {
    position: absolute;
    margin-top: 10px;
    box-sizing: border-box;
    width: 100vw;
    height: 60vh;
    padding: 5vh 5vw;

    background-color: #c9cfcb;
  }

  .keyboard-container::after {
    content: "";
    width: 80vw;
    height: 1vh;
    position: absolute;

    background-color: #c9cfcb;
    border: 5px #7b7d7c solid;
    border-top-color: transparent;
    border-bottom-color: transparent;
    top: 0;
    margin-left: 5vw;
    transform: translateY(-1.8vh);
  }

  .inner-keyboard-container {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background-color: #7b7d7c;
    padding: 1vw;
  }

  .keyboard-container .inner-keyboard-container .big-buttons-list {
    display: flex;
    flex-direction: row;
  }

  .keyboard-container .inner-keyboard-container .big-buttons-list li {
    margin-left: 1vw;
  }
</style>

<section class="keyboard-container">
  <div class="inner-keyboard-container">
    <ul class="big-buttons-list">
      <li>
        <BigButton key="A" color="red" />
      </li>
      <li>
        <BigButton key="B" color="yellow" />
      </li>
      <li>
        <BigButton key="C" color="blue" />
      </li>
      <li>
        <BigButton key="D" color="green" />
      </li>

    </ul>
  </div>
</section>
