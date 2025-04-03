import { API_HOST } from "$env/static/private";
import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, locals }: RequestEvent) {
    const formData = await request.formData();

    const title = formData.get("title");
    const artist = formData.get("artist");
    const audio = formData.get("audio");
    const image = formData.get("image");

    if (typeof title !== 'string' || typeof artist !== 'string' || !title || !artist || !(audio instanceof File)) {
        return json({ error: "Ugyldige upload-oplysninger" }, { status: 400 });
    }

    if (image && !(image instanceof File)) {
        return json({ error: "Invalid image" }, { status: 400 });
    }

    // Prepare the form data to send to the C# backend
    const backendFormData = new FormData();
    backendFormData.append("title", title);
    backendFormData.append("artist", artist);
    backendFormData.append("audioFile", audio);

    if (image) {
        backendFormData.append("coverImageFile", image);
    }

    const response = await fetch(`${API_HOST}/songs`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${locals.user?.jwt}`,
        },
        body: backendFormData// pass the data
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json({ error: errorData.error || "Upload fejlede" }, { status: response.status });
    }
    
    return json({ success: true });
}