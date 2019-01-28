const fs = require("fs");
const os = require("os")

const file = process.argv[2];

const data = fs.readFileSync(file);
const base64 = data.toString("base64").replace(os.EOL, "");
console.log(base64);