import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/task2A', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    let result = (parseInt(req.query.a, 10) || 0) + (parseInt(req.query.b, 10) || 0);
    res.send(String(result));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});