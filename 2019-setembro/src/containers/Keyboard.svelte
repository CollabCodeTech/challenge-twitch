<script>
  import BigButton from "../components/BigButton.svelte";
  import FuncButton from "../components/FunctionalButton.svelte";
  export let Keyboard;
</script>

<style>
  .keyboard-container {
    position: absolute;
    margin-top: 10px;
    box-sizing: border-box;
    width: 100vw;
    height: 63vh;
    padding: 10vh 5vw 5vh;

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
    transform: translateY(-1.5vh);
  }

  .keyboard-container::before {
    content: "Pense Bem®";

    position: absolute;
    display: inline-block;
    width: 20vw;
    height: 5vh;
    margin-right: 5vw;
    border-radius: 10px;
    right: 0;
    top: 0;

    background-color: #ceceac;
    margin-left: 5vw;
    margin-top: 3vh;

    border: 2px #91907c solid;

    color: #3867c1;
    font-size: 5vh;
    font-weight: bold;

    text-align: center;

    /* transform: translateY(-1.5vh); */
  }

  .keyboard-container .inner-keyboard-container {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background-color: #7b7d7c;
    padding: 1vw;
    border-radius: 1vh;
    border: 2px #625f56 solid;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .keyboard-container .inner-keyboard-container .big-buttons-list {
    display: flex;
    flex-direction: row;
  }

  .keyboard-container .inner-keyboard-container .wrap-functions {
    display: inline-block;
  }

  .keyboard-container .inner-keyboard-container .big-buttons-list li {
    margin-left: 1vw;
  }

  .keyboard-container .inner-keyboard-container .wrap-functions .func-butons {
    display: flex;
    flex-direction: row;
    right: 0;
  }

  .keyboard-container
    .inner-keyboard-container
    .wrap-functions
    .func-butons
    li {
    margin-right: 1vw;
  }

  .keyboard-container .inner-keyboard-container .wrap-functions .oper-buttons {
    display: flex;
    flex-direction: row;
    margin-right: 2vw;
  }

  .keyboard-container
    .inner-keyboard-container
    .wrap-functions
    .oper-buttons
    li {
    margin-right: 1vw;
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
    <section class="wrap-functions">
      <ul class="func-butons">
        <li>
          <FuncButton text="enter" color="white" fontColor="blue" />
        </li>
        <li>
          <FuncButton text="livro" color="white" fontColor="blue" />
        </li>
        <li>
          <FuncButton text="desl." color="red" fontColor="blue" />
        </li>
        <li>
          <FuncButton text="liga" color="green" fontColor="blue" />
        </li>
      </ul>
      <ul class="oper-buttons">
        <li>
          <FuncButton text="+" color="blue" fontColor="white" />
        </li>
        <li>
          <FuncButton text="-" color="blue" fontColor="white" />
        </li>
        <li>
          <FuncButton text="X" color="blue" fontColor="white" />
        </li>
        <li>
          <FuncButton text="÷" color="blue" fontColor="white" />
        </li>
      </ul>
    </section>
  </div>
</section>
