const express = require('express');
const fileUpload = require('express-fileupload');
const { infer } = require('../pkg/csdn_ai_demo_lib.js');

const fs = require('fs');
var data_model = fs.readFileSync('mobilenet_v2_1.4_224_frozen.pb');

var labels = [];
fs.readFileSync('imagenet_slim_labels.txt', 'utf-8')
  .split(/\r?\n/)
  .forEach(function (line) {
    labels.push(line);
  });

const app = express();
const host = '0.0.0.0';
const port = 8080;
app.use(express.static('public'));
app.use(fileUpload());
// app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.redirect('/index.html'));

app.post('/infer', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(
    'Received ' +
      req.files.image_file.name +
      ' with size: ' +
      req.files.image_file.size
  );

  let image_file = req.files.image_file;
  console.time(image_file.name);
  var result = JSON.parse(infer(data_model, image_file.data, 224, 224));
  console.timeEnd(image_file.name);

  var confidence = 'low';
  if (result[0] > 0.75) {
    confidence = 'very high';
  } else if (result[0] > 0.5) {
    confidence = 'high';
  } else if (result[0] > 0.2) {
    confidence = 'medium';
  }
  res.send(
    'Detected <b>' +
      labels[result[1] - 1] +
      '</b> with <u>' +
      confidence +
      '</u> confidence.'
  );
});

app.listen(port, host, () =>
  console.log(`Listening at http://${host}:${port}`)
);
