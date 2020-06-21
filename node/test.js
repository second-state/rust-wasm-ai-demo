const { infer } = require('../pkg/csdn_ai_demo_lib.js');

const fs = require('fs');
var data_model = fs.readFileSync("mobilenet_v2_1.4_224_frozen.pb");
var data_img_cat = fs.readFileSync("cat.png");
var data_img_hopper = fs.readFileSync("grace_hopper.jpg");

var result = JSON.parse( infer(data_model, data_img_hopper, 224, 224) );
console.log("Detected object id " + result[1] + " with probability " + result[0]);

var result = JSON.parse( infer(data_model, data_img_cat, 224, 224) );
console.log("Detected object id " + result[1] + " with probability " + result[0]);