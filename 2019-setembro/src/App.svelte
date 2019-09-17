<script>
  import { onMount } from "svelte";
  import Screen from "./containers/Screen.svelte";
  import Keyboard from "./containers/Keyboard.svelte";
  export let display = [0, 1, 2, 3, 4, 5, 6];

  onMount(() => {
    display = [0, 0, 0, 0, 0, 0, 0];
    console.log("onmount", display);
  });
</script>

<style>

</style>

<!-- display -->
<Screen {display} />
<!-- keyboard -->
<Keyboard />
