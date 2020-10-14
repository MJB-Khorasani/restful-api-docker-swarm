const jwt = require('jsonwebtoken');

const { jwtAccessKey, jwtRefreshKey } = require('../config');

class JWTService {
    static async verify (token) {
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(token, jwtAccessKey, (error, decodedToken) => {
                    if (error) {
                        reject(error);
                    } else {
                        !decodedToken ? reject(new Error('invalid token')) : resolve(decodedToken);
                    };
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    static async verifyRefresh (token) {
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(token, jwtRefreshKey, (error, decodedToken) => {
                    if (error) {
                        reject(error);
                    } else {
                        !decodedToken ? reject(new Error('invalid token')) : resolve(decodedToken);
                    };
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    static async sign (payload, options) {
        try {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, jwtAccessKey, options, (error, encoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve (encoded);
                    };
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    static async signRefresh (payload, options) {
        try {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, jwtRefreshKey, options, (error, encoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve (encoded);
                    };
                });
            });
        } catch (error) {
            console.error(error);
            throw error;
        };
    };
};

module.exports = JWTService;