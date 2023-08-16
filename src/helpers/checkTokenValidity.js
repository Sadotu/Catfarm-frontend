import jwt_decode from "jwt-decode"

export function checkTokenValidity(token) {
    const decodedToken = jwt_decode(token);
    const expirationTime = decodedToken.exp * 1000;
    const isExpired = Date.now() > expirationTime;
    return !isExpired;
}