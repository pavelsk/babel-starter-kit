import express from 'express';
import 'isomorphic-fetch';
import _ from 'lodash';

const router = express.Router();

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {};
fetch(pcUrl)
    .then(async(res) => {
        pc = await res.json();
    })
    .catch(err => {
        console.log('Чтото пошло не так:', err);
    });

router.get(/^(.*)$/, (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const url = req.params['0'];
    let status = 200;
    let result = '';

    if (url === '/') {
        result = pc;
    } else if (url === '/volumes') {
        const volumesMap = {};

        pc.hdd.forEach((hdd) => {
            if (volumesMap[hdd.volume]) {
                volumesMap[hdd.volume] += hdd.size;
            } else {
                volumesMap[hdd.volume] = hdd.size;
            }
        });

        Object.keys(volumesMap).forEach((key) => {
            volumesMap[key] = volumesMap[key] + 'B';
        });

        result = volumesMap;
    } else {
        const parts = url.trim().split('/');
        if (parts[0] === '') {
            parts.shift();
        }
        if (parts[parts.length - 1] === '') {
            parts.pop();
        }

        let obj = pc;

        for (let i = 0; i < parts.length; i++) {
            if (obj[parts[i]] !== undefined && !((_.isArray(obj) || _.isString(obj)) && parts[i] === 'length')) {
                obj = obj[parts[i]];
            } else {
                status = 404;
                result = 'Not Found';
                break;
            }
        }

        if (status !== 404) {
            if (_.isString(obj)) {
                result = '"' + obj + '"';
            } else if (_.isNumber(obj)) {
                result = String(obj);
            } else {
                result = obj;
            }
        }
    }

    res.status(status).send(result);
});

export default router;