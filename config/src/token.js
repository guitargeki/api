const { google } = require('googleapis');
const serviceAccount = require('../service-account.json');

function getAccessToken() {
    return new Promise(function (resolve, reject) {

        const jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/firebase.database'
            ],
            null
        );

        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens);
        });
    });
}

module.exports = {
    getAccessToken
};