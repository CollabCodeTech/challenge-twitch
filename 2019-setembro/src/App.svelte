<script>
  import { writable } from "svelte/store";
  import Screen from "./containers/Screen.svelte";
  import Keyboard from "./containers/Keyboard.svelte";

  const operations = writable(0);
  operations.set([]);
  const unsubscribe = operations.subscribe(value => {
    console.log(value);
  });
</script>

<style>

</style>

<!-- display -->
<Screen />
<!-- keyboard -->
<Keyboard />
