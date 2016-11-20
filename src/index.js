import express from 'express';
import cors from 'cors';
import _ from 'lodash';

import task3A from './task3A';

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

app.use('/task3A', task3A);

app.get('/tash2D', (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    function hueToRgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + ( q - p ) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + ( q - p ) * ( ( 2 / 3 - t ) * 6 );
        }

        return p;
    }

    function hslToRgb(bits) {
        let rgba = {};
        const hsl = {
            h: bits[1] / 360,
            s: bits[2] / 100,
            l: bits[3] / 100
        };

        if (hsl.s > 1) {
            return '';
        }

        if (hsl.s === 0) {
            let v = Math.round(255 * hsl.l);
            rgba = {
                r: v,
                g: v,
                b: v
            };
        } else {
            let q = hsl.l < 0.5 ? hsl.l * ( 1 + hsl.s ) : ( hsl.l + hsl.s ) - ( hsl.l * hsl.s );
            let p = 2 * hsl.l - q;
            rgba.r = Math.round(hueToRgb(p, q, hsl.h + ( 1 / 3 )) * 255, 10);
            rgba.g = Math.round(hueToRgb(p, q, hsl.h) * 255, 10);
            rgba.b = Math.round(hueToRgb(p, q, hsl.h - ( 1 / 3 )) * 255, 10);
        }

        rgba = {
            r: Number(rgba.r).toString(16),
            g: Number(rgba.g).toString(16),
            b: Number(rgba.b).toString(16)
        };

        if (rgba.r.length === 1) {
            rgba.r = '0' + rgba.r;
        }
        if (rgba.g.length === 1) {
            rgba.g = '0' + rgba.g;
        }
        if (rgba.b.length === 1) {
            rgba.b = '0' + rgba.b;
        }

        return rgba.r + rgba.g + rgba.b;
    }

    let result = '';

    if (req.query.color) {
        let matches;

        try {
            let color = decodeURIComponent(req.query.color).trim();

            if (color.match(/^#?[a-f0-9A-F]{3,6}$/)) {
                if (color.charAt(0) === '#') {
                    color = color.slice(1);
                }

                if (color.length === 3 || color.length === 6) {
                    if (color.length === 3) {
                        color = color.charAt(0) + color.charAt(0)
                            + color.charAt(1) + color.charAt(1)
                            + color.charAt(2) + color.charAt(2);
                    }

                    result = color.toLowerCase();
                }
            } else if (matches = color.match(/^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i)) {
                for (const i of [1, 2, 3]) {
                    const n = Number(matches[i]);
                    if (n >= 0 && n <= 255) {
                        const s = n.toString(16);
                        if (s.length === 1) {
                            result += '0';
                        }
                        result += s;
                    } else {
                        result = '';
                        break;
                    }
                }
            }
        } catch (e) {
            let color = req.query.color.trim().replace(/%20/g, '');
            console.log(color);

            if (matches = color.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/)) {
                result = hslToRgb(matches);
            }
        }
    }

    res.send(result ? '#' + result : 'Invalid color');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
