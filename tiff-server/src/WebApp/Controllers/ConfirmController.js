const express = require('express');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const UsersRepository = require('../../Infrastructure/MongoDB/Repository/UsersRepository.js');
const Router = express.Router();
const { verifyAndDecodeDataAsync } = require ('../../WebCore/Security/Jwt');
const { sendConfirmationMail } = require('../../WebCore/Security/ConfirmationMail')
const { generateTokenAsync } = require('../../WebCore/Security/Jwt');

Router.get('/:confirm_jwt', async (req, res) => {
    let {
        confirm_jwt
    } = req.params;
    try {
        const decoded = await verifyAndDecodeDataAsync(confirm_jwt);
        await UsersRepository.updateByEmailAsync(decoded.email, {confirmed: 1})
    } catch(err) {
        ResponseFilter.setResponseDetails(res, 400, err, req.originalUrl);
    }

    ResponseFilter.setResponseDetails(res, 201, 'E-mail confirmed!', req.originalUrl);
});

Router.post('/', async (req, res) => {
    console.log(req.body)
    if (req.body.email === undefined) {
        ResponseFilter.setResponseDetails(res, 400, 'Bad!', req.originalUrl);
        return
    }
    confirm_token = await generateTokenAsync({email: req.body.email, salt: 'baby don\'t hurt me'})
    confirm_link = "http://localhost:3000/confirm/" + confirm_token
    sendConfirmationMail(req.body.email, confirm_link)

    console.log(`Resending confirmation mail for ${req.body.email}`)

    ResponseFilter.setResponseDetails(res, 201, 'E-mail sent again!', req.originalUrl);
});

module.exports = Router;