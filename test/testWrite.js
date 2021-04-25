let fs = require("fs");


setInterval(function(){
    let wStream = fs.createWriteStream("./test.log",  {flags: 'a'});
    wStream.write("INFO-TEST INFO LOGGING\r\n");
    wStream.write("SUCCESS-TEST INFO LOGGING\r\n");
    wStream.write("ERROR-TEST INFO LOGGING\r\n");
    wStream.write("FAIL-TEST INFO LOGGING\r\n");
    wStream.write("REQUEST-TEST INFO LOGGING\r\n");
    wStream.write("RESPONSE-TEST INFO LOGGING\r\n");
    wStream.end();
}, 1000);