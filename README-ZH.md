# Tensorflow 图像识别案例

在这个例子中，我们演示了如何在 Node.js 中实现高性能的 AI 推理。 计算密集型的 tensorflow 代码是用 Rust 编写的，并在 WebAssembly 中执行。 使用图像识别的面向用户的应用程序是用 JavaScript 编写的，并运行在 Node.js 中。

你可以在 VSCode 或者 VSCode Codespaces中 [fork](https://github.com/second-state/csdn-ai-demo/fork) 并打开这个 git 库。 使用 VSCode Codespace，您可以在浏览器中编写代码、编译、运行和调试应用程序，而无需安装任何软件。 参见 https://github.com/second-state/ssvm-nodejs-starter/blob/master/readme.md

## 设置

```
$ sudo apt-get update
$ sudo apt-get -y upgrade
$ sudo apt install build-essential curl wget git vim libboost-all-dev

$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ source $HOME/.cargo/env

$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
$ [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
$ [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

$ nvm install v10.19.0
$ nvm use v10.19.0

$ npm install -g wasm-pack
```

## 创建新项目

```
$ cargo new --lib tensorflow
$ cd tensorflow
```

## 修改cargo config 文件

The [Cargo.toml](Cargo.toml) 文件显示依赖项.

* The `wasm-bindgen` crate is required for invoking Rust functions from JavaScript. 
* The `serde` and `serde_json` crates allow us to work with JSON strings to represent complex data types. 
* The `nodejs-helper` crate allows the Rust function to access console, file system, database, and network.
* The `images` crate only enables features that are compatible with WebAssembly.

## 写 Rust 代码

 [src/lib.rs](src/lib.rs) 文件包含 Rust 函数从文件中读取 tensorflow 模型，读取并调整图像大小，然后根据图像运行模型来识别图像主题。 结果作为 JSON 数组返回，其中包含识别对象的 ImageNet 类别 ID 和此预测的置信度。[了解更多](https://github.com/tensorflow/models/tree/master/research/slim/nets/mobilenet) 有关这个案例。

## 创建 WASM bytecode

```
$ wasm-pack build --target nodejs
```

## 创建一个node app

[node/app.js](node/app.js) app 展示了如何从 JavaScript 中调用 Rust 函数。它使用了一个[预先训练的 tensorflow 模型](https://storage.googleapis.com/mobilenet_v2/checkpoints/mobilenet_v2_1.4_224.tgz) 来识别两个图像。

## 测试

```
$ node app.js
```

第一个任务是识别计算机科学家格蕾丝 · 霍珀的图像，识别这个图像需要0.9秒。


```
Model: "mobilenet_v2_1.4_224_frozen.pb"
Image: "grace_hopper.jpg"
Inference: 131.783ms Model loaded
Inference: 367.625ms Plan loaded
Inference: 391.095ms Image loaded
Inference: 427.137ms Image resized
Inference: 1322.184ms Model applied
Inference: 1322.637ms
Detected object id 654 with probability 0.3256046
```

Category ID `654` 可以在 [imagenet_slim_labels.txt](imagenet_slim_labels.txt) 找到。 行数 `654`.

```
654 军装
```

第二个任务是识别一张猫的图像，识别这张图像需要0.8秒。

```
Model: "mobilenet_v2_1.4_224_frozen.pb"
Image: "cat.png"
Inference: 86.587ms Model loaded
Inference: 314.308ms Plan loaded
Inference: 842.836ms Image loaded
Inference: 1166.115ms Image resized
Inference: 2014.337ms Model applied
Inference: 2014.602ms
Detected object id 284 with probability 0.27039126
```

Category ID `284` 可以在这里找到 [imagenet_slim_labels.txt](imagenet_slim_labels.txt). 行数 `284`.

```
284 虎猫
```
