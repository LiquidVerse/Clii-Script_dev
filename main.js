let MyLang = require('./engine/clilite/clilite_engine')

let lang = new MyLang()
const fs = require('fs');

var srcfile = fs.readFileSync( "test.clii" );

let result = lang.exec(srcfile + "")
console.log(
    result === srcfile.expect ? '[OK]' : '[NG]',
    srcfile.input, '=', result
)