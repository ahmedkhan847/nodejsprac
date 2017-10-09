var fs = require("fs");

console.log("Going to read directory /tmp");
fs.readdir("D:/nodejs practice", function (err, files) {
    if (err) {
        return console.error(err);
    }
    files.forEach(function (file) {
        console.log(file);
    });
});
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});