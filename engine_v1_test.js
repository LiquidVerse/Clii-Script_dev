const fs = require('fs');
//const clii_core = require('./engine');

var srcfile = fs.readFileSync( "test.clii" );
var arg1 = "test"

// Returnのテスト用
// console.log(clii_core = require('./engine').runscript(srcfile,arg1));

// JavaScriptからCliiScriptを実行する関数
// clii_core = require('./engine').runscript(srcfile);