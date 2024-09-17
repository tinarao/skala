import { persisted } from 'svelte-persisted-store';

/**
 * @typedef {Object} UserState
 * @property {number} [id]
 * @property {string} [username]
 * @property {string | null} [email]
 * @property {string | null} [picture]
 * @property {string | null} [plan]
 * @property {string | null} [role]
 */

/** @type {UserState} */
let initialState = {
	id: undefined,
	username: undefined,
	picture: undefined,
	email: undefined,
	plan: undefined,
	role: undefined,
};

export const userStore = persisted('user', initialState);