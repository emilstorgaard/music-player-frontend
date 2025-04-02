import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

// Function to validate and decode JWT
export const validateToken = (token: string) => {
	try {
		return jwt.verify(token, JWT_SECRET_KEY, { ignoreNotBefore: false, clockTolerance: 10 }); // 10-second tolerance
	} catch (error: any) {
		console.error('Token validation error:', error);
		return null;
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	// Get JWT from cookies
	const token = event.cookies.get('jwt');

	if (token) {
		// Validate and decode token
		const decodedToken = validateToken(token);

		if (!decodedToken) {
			return new Response('Invalid or expired token', { status: 401 });
		}

		// Extract user details safely
		const { email, uid } = decodedToken as { email: string; uid: string; };

		// Add user to event.locals
		event.locals.user = { email, uid, jwt: token };
	}

	const response = await resolve(event);
    return response;
}