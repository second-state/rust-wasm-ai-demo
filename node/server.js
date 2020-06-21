const express = require('express');
const fileUpload = require('express-fileupload');
const { infer } = require('../pkg/csdn_ai_demo_lib.js');

const fs = require('fs');
var data_model = fs.readFileSync("mobilenet_v2_1.4_224_frozen.pb");

var labels = [];
fs.readFileSync('imagenet_slim_labels.txt','utf-8').split(/\r?\n/).forEach(
  function(line){
    labels.push(line);
  }
);

const app = express();
const port = 8080;
app.use(express.static('public'));
app.use(fileUpload());
// app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.redirect("/index.html"));

app.post('/infer', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log (req.files);

  let image_file = req.files.image_file;
  var result = JSON.parse( infer(data_model, image_file.data, 224, 224) );
  res.send("<b><u>" + labels[result[1]-1] + "</u></b> with confidence " + result[0])
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
