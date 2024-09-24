// See https://kit.svelte.dev/docs/types#app

import type { UserPicNameId } from "$lib/typedefs";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserPicNameId
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
