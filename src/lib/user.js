import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

/**
 * @typedef {Object} UserState
 * @property {number} [id]
 * @property {string} [username]
 */

/** @type {UserState} */
let initialState = {
	id: undefined,
	username: undefined
};

export const userStore = persisted('user', initialState);
// export let userStore = writable(initialState)
