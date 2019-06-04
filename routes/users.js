import express from 'express';

import sendApi from '../api/send';
import receiveApi from '../api/receive';

const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.get('/:userID', ({params: {userID}}, res) => {
    console.log("IN GET /USERS/" + userID);
    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.REGISTRATION, userID]);
    query(CONSTANTS.GET_ALL_LANGUAGES, [])
    .then((array) => {
        const langsJSON = JSON.stringify(array);

        console.log(`GET User response: ${langsJSON}`);

        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});

router.put('/:userID', ({body, params: {userID}}, res) => {
    console.log("RECEIVED OBJECT: " + body.toString());
    if (body.nickname) query(CONSTANTS.UPDATE_NICKNAME, [body.nickname, userID]);
    query(CONSTANTS.INSERT_USER_LANGUAGES, [userID, body.languages]);

    res.sendStatus(204);

    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.IN_MENU, userID]);
    query(CONSTANTS.UPDATE_PERMISSION_LEVEL, ['1', userID]);
    //sendApi.sendUserMenu(userID);
});

router.put('/:userID/nickname', ({body, params: {userID}}, res) => {
    query(CONSTANTS.UPDATE_NICKNAME, [body.nickname, userID]);

    res.sendStatus(204);

    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.IN_MENU, userID]);
});


export default router;