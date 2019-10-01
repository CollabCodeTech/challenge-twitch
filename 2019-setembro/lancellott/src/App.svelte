<script>
  import { onMount } from "svelte";
  import Screen from "./containers/Screen.svelte";
  import Keyboard from "./containers/Keyboard.svelte";
  import { display as dp } from "./store/store";
  let easter_eggs = ["3141592", "667428", "6022141", "6022141"];
  export let initialState = {
    status: false,
    displayValue: [0, 0, 0, 0, 0, 0, 0],
    operation: null,
    values: [0, 0],
    current: 0,
    clearDisplay: true
  };
  export let display_off = ["", "", "", "", "", "", ""];
  export let display_on = [0, 0, 0, 0, 0, 0, 0];

  let display;

  const unsubscribe = dp.subscribe(value => {
    // console.log("dp: ", value);
    display = value;
  });

  export let turn_on = () => {
    console.log("ligando");
    updateDisplay({ ...initialState, status: true });
  };

  export let turn_off = () => {
    console.log("desligando");
    let newValue = { ...display, displayValue: display_off, status: false };
    updateDisplay(newValue);
  };

  export let updateDisplay = newValue => {
    dp.update(value => {
      return newValue;
    });
  };

  const setOperation = operation => {
    console.log(`operation: ${operation}`);
    switch (operation) {
      case "÷": {
        operation = "/";
        break;
      }
      case "X": {
        operation = "*";
        break;
      }
    }
    console.log(display);
    if (display.current === 0) {
      updateDisplay({
        ...display,
        operation: operation,
        current: 1,
        clearDisplay: true
      });
    } else {
      const equals = operation === "enter";
      const currentOperation = display.operation;

      const values = [...display.values];
      try {
        console.log(`${values[0]} ${currentOperation} ${values[1]}`);
        values[0] = Math.floor(
          Number(eval(`${values[0]} ${currentOperation} ${values[1]}`))
        );
      } catch (e) {
        values[0] = display.values[0];
        console.log(e);
      }
      values[1] = 0;

      updateDisplay({
        ...display,
        values,
        displayValue: formatValueToDisplay("" + values[0]),
        current: equals ? 0 : 1,
        operation: equals ? null : operation,
        clearDisplay: true
      });
    }
    console.log(display);
  };

  export const setDigit = digit => {
    console.log(`Digit: ${digit}`);
    const clearDisplay =
      display.displayValue.join("") === "0000000" || display.clearDisplay;
    console.log("clear display? ", clearDisplay);
    const currentValue = clearDisplay ? "" : display.displayValue.join("");
    console.log("current value: ", currentValue);
    const displayValue = formatValueToDisplay(currentValue + "" + digit);
    // console.log("display value: ", currentValue);
    // console.log("Novo valor: ", currentValue + "" + digit);
    updateDisplay({ ...display, displayValue, clearDisplay: false });
    // console.log("display value: ", displayValue);

    const index = display.current;
    const newValue = parseInt(displayValue.join(""));
    const values = [...display.values];
    values[index] = newValue;
    updateDisplay({ ...display, values, displayValue, clearDisplay: false });
  };

  const formatValueToDisplay = value => {
    if (value.length < 7) {
      let retorno = new Array(7 - value.length).fill(0);
      return [...retorno, ...value.split("")];
    } else if (value.length > 7) {
      return value.split("").splice(1, 7);
    } else {
      return value.split("");
    }
  };

  const handleEasterEgg = value => {
    setDigit(value);
    setTimeout(() => askEasterEgg(value), 200);
  };

  const askEasterEgg = value => {
    let resp = "";
    switch (value) {
      case "3141592": {
        resp = "pi";
        break;
      }
      case "667428": {
        resp = "gravitação universal";
        break;
      }
      case "6022141": {
        resp = "constante de avogadro";
        break;
      }
      case "2997924": {
        resp = "velocidade da luz";
        break;
      }
    }
    let user_input = window.prompt(
      "Você clicou num botão easter egg. Você sabe qual constante físico/matemática é este número?"
    );
    let acertou = false;
    if (user_input === resp) {
      alert("Parabéns, você acertou, você é muito inteligente!");
      acertou = true;
    } else {
      while (confirm("Você errou, quer tentar novamente?")) {
        user_input = window.prompt(
          "Você clicou num botão easter egg. Você sabe qual constante físico/matemática é este número?"
        );
        if (user_input === resp) {
          alert("Parabéns, você acertou, você é muito inteligente!");
          acertou = true;
          break;
        }
      }
    }
    if (!acertou) {
      if (confirm("Você gostaria de saber a resposta?")) {
        alert(`Esta constante representa: ${resp}`);
      }
    }
  };

  // onMount(() => {
  //   console.log("onmount", display);
  // });
</script>

<style>

</style>

<!-- display -->
<Screen display={display.displayValue} />
<!-- keyboard -->
<!-- <Keyboard /> -->
<Keyboard
  turnOn={turn_on}
  turnOff={turn_off}
  {updateDisplay}
  handleNumberInsert={setDigit}
  status={display.status}
  handleFunction={setOperation}
  easterEgg={handleEasterEgg} />
