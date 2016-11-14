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

app.get('/task2B', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    let result;

    const capitalFirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    if (req.query.fullname) {
        const words = req.query.fullname.trim().split(/\s+/);

        if (words.length > 0 && words.length <= 3) {
            result = [];
            for (let i = 0; i < words.length; i++) {
                if (words[i].match(/[0-9\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?]/) ||
                    words[i].toLowerCase().match(/([a-z][а-я]|[а-я][a-z])/)
                ) {
                    result = 'Invalid fullname';
                    break;
                } else {
                    if (i === words.length - 1) {
                        result.unshift(capitalFirst(words[i]));
                    } else {
                        result.push(words[i].charAt(0).toUpperCase() + '.');
                    }
                }
            }

            if (Array.isArray(result)) {
                result = result.join(' ');
            }

        } else {
            result = 'Invalid fullname';
        }
    } else {
        result = 'Invalid fullname';
    }

    res.send(String(result));
});

app.get('/task2C', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    let result;

    if (req.query.username) {
        result = req.query.username.match(/^(?:.+?\.[a-z\-0-9]+?\/|)@?([^\?\/]+)/);
    }

    res.send(result ? '@' + result[1] : 'Invalid username');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
