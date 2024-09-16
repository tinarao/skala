import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

/**
 * @typedef {Object} UserState
 * @property {number} [id]
 * @property {string} [username]
 * @property {string | null} [picture]
 */

/** @type {UserState} */
let initialState = {
	id: undefined,
	username: undefined,
	picture: undefined
};

export const userStore = persisted('user', initialState);