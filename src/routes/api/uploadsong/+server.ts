import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, locals }: RequestEvent) {
    const data = await request.formData();
	const title = data.get('title');
	const artist = data.get('artist');
	const image = data.get('image');
	const audio = data.get('audio');

    console.log(title, artist)

    if (typeof title !== 'string' || typeof artist !== 'string' || !title || !artist || !(audio instanceof File)) {
        return json({ error: "Ugyldige upload-oplysninger" }, { status: 400 });
    }

    if (image) {
        if ( !(image instanceof File)) return json({ error: "Invalid image" }, { status: 400 });
    }

    // Send login request til C# backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    if (image) formData.append('coverImageFile', image);
    formData.append('audioFile', audio);
    
    const response = await fetch(`${API_HOST}/songs`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${locals.user?.jwt}`, // Keep this header
        },
        body: formData // Pass FormData directly
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Upload fejlede" }, { status: response.status });
    }
    
    return json({ success: true });
}