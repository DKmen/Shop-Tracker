import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';

// inilize env
const { JWT_SECRET = '', JWT_TOKEN_EXPIRESIN = '3600', ISSUER = '', SUBJECT = '' } = process.env;

/**
 * Generate JWT token
 * @param jtl - JWT token id
 * @param user - User object
 * @returns JWT token
*/
export const generateToken = (jtl: string, payload:JwtPayload): string => {
    const accessTokenOpts: SignOptions = {
        subject: SUBJECT,
        expiresIn: parseInt(JWT_TOKEN_EXPIRESIN),
        algorithm: 'HS256',
        issuer: ISSUER,
        jwtid: jtl
    }

    // Generate JWT token
    const accessToken = jwt.sign(payload, JWT_SECRET, accessTokenOpts);
    return accessToken;
}

export const decode = (accessToken: string) => {
    return jwt.decode(accessToken);
}