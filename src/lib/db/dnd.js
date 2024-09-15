import { writable } from 'svelte/store';

// Task ID
export const dndTask = writable({
	/** @type {import("$lib/typedefs").Task | undefined} */
	task: undefined,

	dragging: false
});
