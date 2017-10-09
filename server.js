var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var formidable = require('formidable');
// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();
var query = '';

function renderPage(pagename, request, response, query = null) {
    fs.readFile("header.htm", function (herr, head) {
        if (herr) {
            console.log(herr);
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end();
        } else {
            header = head.toString();
            fs.readFile("footer.htm", function (ferr, foot) {
                if (ferr) {
                    console.log(ferr);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end();
                } else {
                    footer = foot.toString();
                    fs.readFile(pagename + ".htm", function (perr, page) {
                        if (perr) {
                            console.log(perr);
                            // HTTP Status: 404 : NOT FOUND
                            // Content Type: text/plain
                            response.writeHead(404, { 'Content-Type': 'text/html' });
                            var html = header + '<div class="container"> <div class="row"> <h1> Page not found </h1> </div></div>' + footer;
                            // Write the content of the file to response body
                            response.write(html);
                            response.end();
                        } else {
                            //Page found	  
                            // HTTP Status: 200 : OK
                            // Content Type: text/plain
                            if (query == null) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                var html = header + page.toString() + footer;
                                // Write the content of the file to response body
                                response.write(html);
                                response.end();
                            } else {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                var li = '<li class="list-group-item">' + query.email + '</li><li class="list-group-item">' + query.pwd + '</li>';
                                var cPage = page.toString();
                                var fPage = cPage.replace("<list>", li);
                                var html = header + fPage + footer;
                                // Write the content of the file to response body

                                response.write(html);
                                response.end();
                            }
                        }

                    });
                }
            });
        }

    });
}

function getQuery(request) {
    request.on("data", function (data) {
        query += data;
    });
}
// Create a server
http.createServer(function (request, response) {
    // Parse the request containing file name
    var pathname = url.parse(request.url).pathname;
    var header = null;
    var footer = null;
    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");
    if (request.method == "GET") {
        if (pathname == "/") {
            renderPage("index", request, response);
        } else {
            renderPage(pathname.substr(1), request, response);
        }
    } if (request.method == "POST") {
        if (pathname == "/contact") {
            getQuery(request);
            request.on('end', function () {
                var post = qs.parse(query);
                renderPage("success", request, response, post);
            });
        } else if (pathname == "/upload") {
            var form = new formidable.IncomingForm();
            form.parse(request, function (err, fields, files) {
                var oldpath = files.file.path;
                var newpath = 'files/' + files.file.name;
                fs.readFile(oldpath, function (err, data) {
                    fs.writeFile(newpath, data, function (err) {
                        query = null;
                        if (err) {
                            console.log(err);
                        } else {
                            query = {
                                email: 'File uploaded successfully',
                                pwd: files.file.name
                            };
                        }
                        renderPage("success", request, response, query);
                    });
                });
            });
        } else {
            renderPage("", request, response);
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
    }
}).listen(8081);
// Bind the data_received event with the anonymous function
eventEmitter.on('error', function (err) {
    console.log(err);
});
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');