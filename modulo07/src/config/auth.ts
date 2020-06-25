export default {
    jwt: {
        secret: process.env.JWT_SECRET || 'asuhshuahuas',
        expiresIn: '7d',
    },
};
