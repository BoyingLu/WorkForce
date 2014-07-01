var http = require('http');
var fs = require('fs');
var path = require('path');

function handle_incoming_request(req, res) {
    console.log("Incoming request: "+req.method+ " " + req.url);

    if (req.method.toLowerCase() == 'get') {
        getHomePage('./content/index.html', res);
    }else {
        res.writeHead(404, {"Content-Type" : "application/json" });
        var out = {
              error: "not_found",
              message: "'"+ req.url + "' not found"
        };
        res.end(JSON.stringify(out)+"\n");
    }
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);

function getHomePage(file, res) {
    var rs = fs.createReadStream(file);
    var ct = content_type_for_path(file);
    res.writeHead(200, { "Content-Type" : ct });

    rs.on (
       'error', 
       function (e) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error : "not_found",
                        message : "'" + file + "' not found"};
            res.end(JSON.stringify(out) + "\n");
            return;
       }
    );

    rs.pipe(res);
}

function content_type_for_path(file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html' : return 'text/html';
        case '.js' : return 'text/javascript';
        case '.css' : return 'text/css';
        case '.jpg' : case '.jpeg' :  return 'image/jpeg';
        default: return 'text/plain';
    }
}
