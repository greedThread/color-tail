#!/usr/bin/env node
// const TailFile = require('@logdna/tail-file');

var ts = require('tail-stream');
const path = require("path");
const fs = require('fs');
const chalk = require('chalk');
const EOL = require("os").EOL;

let LINE_FILTER, LINE_FILTER_KEY;
let WORD_FILTER, WORD_FILTER_KEY;

function filterLineColor(message) {
    let key = LINE_FILTER[getTextKeyInList(LINE_FILTER_KEY, message)];

    let color = chalk[key];
    if(color === undefined) color = chalk.reset;

    return color(message);
}

function filterWordColor(message) {
    for(let i = 0; i < WORD_FILTER_KEY.length; i++) {
        let pattern = new RegExp("("+ WORD_FILTER_KEY[i] +")");
        let colorChalk = chalk[WORD_FILTER[WORD_FILTER_KEY[i]]];
        message = message.replace(pattern, colorChalk("$1"));
    }

    return message;
}

function displayUsage() {
    console.log('usage: color-tail [options] <command>')
    console.log('');
    console.log('color-tail -h, --help             all available commands and options');
    console.log('color-tail <command> -h           help on a specific command');
    console.log('');
}

function displayHelp() {
    console.log("Options:");
    console.log("");
    console.log("-h, --help");
    console.log("        command help print");

    console.log("Commands:")
    console.log("");
    console.log("start <TargetFile, OptionalFile>");
    console.log("        file position start print");


    console.log("end <TargetFile, OptionalFile>");
    console.log("        file position end print");
}

function processOptions(option) {
    switch (option) {
        case "-h":
        case "--help":
            displayHelp();
            break;
        default:
            displayUsage();
    }
}

function processCommand(command) {
    switch (command) {
        case "start":
        case "end":
            tail(command);
            break;
        default:
            displayUsage();
    }
}

let args = process.argv.splice(process.execArgv.length + 2);
if(args.length === 0) {
    //throw new Error("input your options or command ");
    displayUsage();
}
else {
    let command    = args[0];
    if(!isNaN(command)) {
        displayUsage();
    }
    else if(command.includes("-")) {
        processOptions(command);
    }
    else {
        processCommand(command);
    }
}

function getTextKeyInList(arr, targetStr) {
    for(let i in arr) {
        let key = arr[i];
        if(targetStr.includes(key)) {
            return key;
        }
    }
    return "reset";
}

function filterdColor(message) { 
    try {
        if(typeof message === "string") {
            // 라인에 대한 필터를 처리한다.
            message = filterLineColor(message);
            message = filterWordColor(message);
            // 단어에 대한 필터를 처리한다.
        }
    }
    catch(err) {

    }

    return message;
}

function printMultiLine(multiChunk) {
    let textLine = multiChunk.split(EOL);
    for(let idx in textLine) {
        if(textLine[idx] !== "") console.log(filterdColor(textLine[idx]));
    }
}

function initColorFilter() {
    let jsonFilePath = args[2] === undefined ? "./lib/color-filter.json" : args[2];
    let jsonFile = fs.readFileSync(jsonFilePath, 'utf-8');

    let FILTER = JSON.parse(jsonFile);

    LINE_FILTER      =  FILTER["LINE"];
    LINE_FILTER_KEY  =  Object.keys(LINE_FILTER);
 
    WORD_FILTER        = FILTER["WORD"];
    WORD_FILTER_KEY    = Object.keys(FILTER["WORD"]);

}

function tail(command) {
    let fileName   = args[1];
    if(fileName === undefined) {
        console.log("ERROR: File not found");
        return;
    }
    initColorFilter();

    const tailOpt ={
        beginAt: 0,
        onMove: 'follow',
        detectTruncate: false,
        endOnError: false
    }

    if(command === "start") tailOpt["beginAt"] = 0;
    else if(command === "end") tailOpt["beginAt"] = "end";

    var tstream = ts.createReadStream(fileName, tailOpt);
    // var fs = require("fs");
    tstream.on('data', function(data) {
        printMultiLine(data.toString());
    });

    tstream.on('eof', function() {
        // console.log("reached end of file");
    });

    tstream.on('move', function(oldpath, newpath) {
        // console.log("file moved from: " + oldpath + " to " + newpath);
    });

    tstream.on('truncate', function(newsize, oldsize) {
        // console.log("file truncated from: " + oldsize + " to " + newsize);
    });

    tstream.on('end', function() {
        // console.log("ended");
    });

    tstream.on('error', function(err) {
        console.log("error: " + err);
    });
}


