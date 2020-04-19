const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express')
const app = express()
const path = require('path');

const bodyParser = require('body-parser')

const axios = require('axios')
const CircularJSON = require('circular-json');
const url_1 = require('url')

const QRCode = require('qrcode')

app.use(express.static(__dirname + '/static_files'));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/static_files/index.html'));
});

function generateUrl(method, reqMethod = 'POST') {
    let formatUrlOptions = {
        protocol: "https",
        hostname: 'api-ssl.bitly.com',
        pathname: `/v4/${method}`
    };

    return url_1.parse(url_1.format(formatUrlOptions));
}

const url = url_1.format(generateUrl('shorten', 'POST'));

app.post('/request', (req, res) => {
	const requestOptions = {
		method: 'post',
		url,
		headers: {
			Authorization: ''
		},
		data: {
			domain: "bit.ly",
	    	long_url: req.body.long_link
		},
		responseType: 'json'
	}

	requestOptions.headers['Content-Type'] = 'application/json';

	axios(requestOptions)
		.then(function (response) {
			if (response.status === 200 || response.status === 201) {
				const shortenedLink = CircularJSON.stringify(response.data.link);
				QRCode.toDataURL(shortenedLink).then(qrCode => {
					res.send({status: response.status, link: shortenedLink, qrCode: qrCode});
				})
				.catch(err => {
					res.send({status: response.status, link: shortenedLink});
				})
			}
	    })
	    .catch(function (error) {
	    	if (error) {
				res.send(CircularJSON.stringify(error));
	    	}
	    })
});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

