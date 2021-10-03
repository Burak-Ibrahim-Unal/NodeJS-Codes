const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req.url,req.method,req.headers);
    // res.write("<p><h1>Hello</h1></p>");
    // res.end();

    if (req.url==="/") {
        res.write("<h1>index section</h1>");
        res.end();
    }
    if (req.url==="/about") {
        res.write("<h1>this is about section</h1>");
        res.end();
    }

});

server.listen(3000);
