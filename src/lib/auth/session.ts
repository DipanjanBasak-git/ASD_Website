import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.APP_SECRET || 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encryptSession(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decryptSession(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

// Alias for consistency with login API
export const createSession = encryptSession;
