const fs = require('fs')
const clii_core = require('./engine')

var srcfile = fs.readFileSync( "test.clii" );

// Returnのテスト用
// console.log(clii_core.runscript(srcfile));

// JavaScriptからCliiScriptを実行する関数
clii_core.runscript(srcfile);