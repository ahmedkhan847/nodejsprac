var fs = require('fs');
var buf = new Buffer(1024);
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var fileData = ' ';
rl.question('What do you think of Node.js? ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Thank you for your valuable feedback: ${answer}`);
    fileData += answer;
    rl.close();
    fs.open("answer.txt", "a+", function (err, fd) {

        if (err) {
            return console.error(err);
        }
        console.log("Going to write into existing file");
        fs.writeFile(fd, fileData, function (err) {
            if (err) {
                return console.error(err);
            }

            console.log("Data written successfully!");
            console.log("Let's read newly written data");
            fs.readFile("answer.txt", function (err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log("Asynchronous read: " + data.toString());
            });


        });
        // Truncate the opened file.
        fs.open("truncate.txt", "r+", function (err, fd) {
            fs.ftruncate(fd, 10, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
                    if (err) {
                        console.log(err);
                    }

                    // Print only read bytes to avoid junk.
                    if (bytes > 0) {
                        console.log(buf.slice(0, bytes).toString());
                    }

                    // Close the opened file.
                    fs.close(fd, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log("File closed successfully.");
                    });
                });
                console.log("File truncated successfully.");
                console.log("Going to read the same file");
            });
        });

    });
});

