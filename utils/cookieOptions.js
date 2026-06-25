function getAuthCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'lax' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

module.exports = { getAuthCookieOptions };
