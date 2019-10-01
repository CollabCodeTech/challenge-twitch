import { writable } from 'svelte/store';

// export const display = writable(["", "", "", "", "", "", ""]);
export const display = writable({
  status: false,
  displayValue: ['w', 'e', 'l', 'c', 'o', 'm', 'e'],
  operation: null,
  values: [0, 0],
  current: 0
});