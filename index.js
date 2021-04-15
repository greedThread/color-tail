#!/usr/bin/env node
// const TailFile = require('@logdna/tail-file');

const Tail = require('tail').Tail;

const path = require("path");
const fs = require('fs');
const chalk = require('chalk');


let FILTER, FILTER_KEY;

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m", // Scarlet

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    },

    SUCCESS : "\x1b[34m",
    WARN    : "\x1b[33m",
    ERROR   : "\x1b[31m",
    INFO    : "\x1b[32m",
};

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
    message += "---------"

    let color = "";
    try {
        if(typeof message === "string") {
            if(FILTER[getTextKeyInList(FILTER_KEY, message)] === undefined) return COLORS["reset"] + message;
            color = COLORS[FILTER[getTextKeyInList(FILTER_KEY, message)]];
            color = color === undefined ? COLORS["reset"] : color;
        }
    }
    catch(err) {

    }

    if(color === "") color = (COLORS["reset"]);

    return (color) + message;
}

function printMultiLine(multiChunk) {
    multiChunk = multiChunk.replace(/\n/gi, "")
    let textLine = multiChunk.split("\r");

    for(let idx in textLine) {
        console.log((textLine[idx]));
    }
}

function tail(command) {
    let fileName   = args[1];
    if(fileName === undefined) {
        console.log("ERROR: File not found");
        return;
    }

    let jsonFilePath = args[2] === undefined ? "./lib/color-filter.json" : args[2];
    let jsonFile = fs.readFileSync(jsonFilePath, 'utf-8');

    FILTER      =  JSON.parse(jsonFile);
    FILTER_KEY  = Object.keys(FILTER);

    const tailOpt = {
        encoding : 'utf-8'
    }

    let isInit = false;
    if(command === "start") {
        tailOpt["startPos"] = 0;
    }
    else {
        isInit = true;
    }

    const tail = new Tail(fileName, tailOpt);

    console.log("aaaaaaaaaaaaaaaaaaaaa");
    tail.on('line', (chunk) => {
        if(!iscInit) {
            isInit = true;
            printMultiLine(chunk);
        }
        else {
            console.log(filterdColor(chunk))
        }
    })


    tail.on('error', (err) => {
        console.error('A TailFile stream error was likely encountered', err)
    });

    tail.watch();
}


