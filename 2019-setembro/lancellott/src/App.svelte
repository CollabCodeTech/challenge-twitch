<script>
  import { onMount } from "svelte";
  import Screen from "./containers/Screen.svelte";
  import Keyboard from "./containers/Keyboard.svelte";
  import { display as dp } from "./store/store";

  export let initialState = {
    status: false,
    displayValue: [0, 0, 0, 0, 0, 0, 0],
    operation: null,
    values: [0, 0],
    current: 0
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

  // export let handleNumberInsert = number => {
  //   console.log("number from handle: " + number);
  // };

  const setOperation = operation => {
    console.log(`operation: ${operation}`);
    if (display.current === 0) {
      updateDisplay({
        ...display,
        operation,
        current: 1
      });
    } else {
      const equals = operation === "enter";
      const currentOperation = display.operation;

      const values = [...display.values];
      try {
        values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`);
      } catch (e) {
        values[0] = display.values[0];
        console.log(e);
      }
      values[1] = 0;

      updateDisplay({
        ...display,
        values,
        displayValue: values[0],
        current: equals ? 0 : 1,
        operation: equals ? null : operation
      });
    }
  };

  export const setDigit = digit => {
    console.log(`Digit: ${digit}`);

    const currentValue = display.displayValue.join("");
    console.log("display value: ", currentValue);
    console.log("Novo valor: ", currentValue + "" + digit);
    const displayValue = formatValueToDisplay(currentValue + "" + digit);
    console.log("display value: ", displayValue);
    updateDisplay({ ...display, displayValue });

    const index = display.current;
    const newValue = parseFloat(displayValue);
    const values = [...display.values];
    values[index] = newValue;
    updateDisplay({ ...display, values, displayValue });
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
  handleFunction={setOperation} />
