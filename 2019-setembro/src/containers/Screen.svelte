<script>

</script>

<style>
  section {
    width: 100vw;
    height: 35vh;
    background-color: #c9cfcb;
  }

  section .tela,
  section .disquete {
    height: 100%;
    display: flex;

    justify-content: center;
    /* align-items: center; */

    float: left;
  }
  .tela {
    display: flex;
    width: 55%;
    flex-direction: column;
    align-items: flex-end;
  }
  .disquete {
    box-sizing: border-box;
    width: 45%;
    flex-direction: column;
    align-items: flex-start;
  }

  .tela > .visor {
    box-sizing: border-box;
    border: 5px solid #abb1ad;
    border-right: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    padding: 5px 0px 5px 5px;
  }

  .tela > .visor > .display {
    width: 40vw;
    height: 5vw;
    display: flex;
    background-color: #220708;
    /* justify-content: space-evenly; */
    justify-content: center;
    align-items: center;
  }

  .display .char {
    font-family: "digital_display";
    background-color: #220708;
    color: #610f19;
    display: inline-block;
    text-transform: uppercase;

    width: 3vw;
    height: 3vw;
    font-size: 2.5vw;
    line-height: 3vw;

    text-align: center;

    margin: 0 0.5vw;
  }
  .tela .text-logo {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;

    width: 40vw;
    height: 2.5vw;
    padding: 0.5vw 2vw;
    background-color: #000;
  }

  .tela .text-logo > .text {
    color: #fff;
    font-weight: bold;
    font-size: 1vw;
    line-height: 1.5vw;
  }

  .visor .text-logo .colors {
    margin-right: 2vw;
    width: 20vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text-logo .colors .color {
    width: 4vw;
    height: 1vw;
    border-radius: 5px;
    background-color: #fff;
  }

  .text-logo .colors .color.red {
    background-color: #bb3431;
  }

  .text-logo .colors .color.blue {
    background-color: #194391;
  }

  .text-logo .colors .color.yellow {
    background-color: #d4af06;
  }

  .text-logo .colors .color.green {
    background-color: #103b39;
  }

  .disquete > .entrada-disquete {
    position: absolute;
    height: 8.55vw;
    width: 30vw;
    box-sizing: border-box;
    border: 5px solid #abb1ad;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 0px 5px 5px;
  }

  .disquete > .entrada-disquete::before {
    content: "";
    border: 2px solid #abb1ad;
    width: 5vw;
    height: 5vw;
    border-radius: 5px;

    box-shadow: 3px 3px 10px 5px inset #abb1ad;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .disquete > .entrada-disquete::after {
    content: "";
    border: 2px solid #abb1ad;
    width: 15vw;
    height: 1vw;
    border-radius: 5px;

    box-shadow: 3px 3px 10px 5px inset #abb1ad;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<section>
  <div class="tela">
    <div class="visor">
      <ul class="display">
        <li class="char">0</li>
        <li class="char">1</li>
        <li class="char">2</li>
        <li class="char">3</li>
        <li class="char">4</li>
        <li class="char">5</li>
        <li class="char">6</li>
      </ul>
      <div class="text-logo">
        <span class="text">TECTOY</span>
        <ul class="colors">
          <li class="color red" />
          <li class="color yellow" />
          <li class="color blue" />
          <li class="color green" />
        </ul>
      </div>
    </div>
  </div>
  <div class="disquete">
    <div class="entrada-disquete" />
  </div>
</section>
