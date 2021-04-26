1. global install

- install 
  - npm install 
  - npm install -g ./color-tail (<= this project)
- uninstall 
  - npm uninstall -g ./color-tail

2. usage  
- color-tail start [file path] [color-filter json]
- color-tail end [file path]  [color-filter json]
- ex> color-tail start home/21-01-01.log my-filter.json 

3. color-filter.json  
color-ref : https://www.npmjs.com/package/chalk
   


```
{
"LINE" : {
    "INFO"    : "green",
    "SUCCESS" : "blue",
    "WARN"    : "yellow",
    "ERROR"   : "red",
    "FAIL"    : "red",
    "SELECT": "cyan",
    "UPDATE": "cyan",
    "DELETE": "cyan",
    "REPLACE":"cyan",

    "RES::":  "green",
    "REQ::":  "green",

    "REQUEST": "green",
    "RESPONSE": "green"
},
"WORD" : {
    "user_idx" : "bgBlackBright",
    "abc"  : "bgWhite"
    }
}
```