import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ cookies }: RequestEvent) {
    cookies.delete('jwt', { path: '/' });
   
    return json({ success: true });
}