import { UPLOADTHING_TOKEN } from "$env/static/private";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
    token: UPLOADTHING_TOKEN
});