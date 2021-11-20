const rl= require('readline');
const fs = require('fs');

module.exports = {
    version: '1.0.0-beta1',
    clii: '\n  /|___/|  \n ／ |__| ＼\n|  ●   ●  |\n＼_______／\n　 |   |　　\n　 ＼_／　　',
    clione: '\n  /|___/|  \n ／      ＼\n|  ●   ●  |\n＼_______／\n　 |   |　　\n　 ＼_／　　',
    error_message:function(message){
        //return '\n  /|___/|  \n ／ |__| ＼\n| ＞  ＜  |\n＼_______／   < ' + message + '\n　 |   |　　\n　 ＼_／　　';
        return '\n  /|___/|  \n ／ |__| ＼ ？\n|  ●   ●  |\n＼_______／   < ' + message + '\n　 |   |　　\n　 ＼_／　　';
        
    }, 
    message:function(message){return '\n  /|___/|  \n ／ |__| ＼\n|  ●   ●  |\n＼_______／   < ' + message + '\n　 |   |　　\n　 ＼_／　　'}, 

    //CLI
    cli_anm:function(animationObject,Text,doneText){
        const row = animationObject[0].split("\n").length;
    
        const loop = () => {
          let x = 0;
          return setInterval(() => {
                rl.clearLine(process.stdout, 0);
                console.log(`${animationObject[x++]}` + Text + `${".".repeat(x)}`);
                x %= animationObject.length;
                rl.moveCursor(process.stdout, 0, -row);
            }, 250);
        };
    
        const main = () => {
            const timer = loop();
    
            setTimeout(async () => {
                clearInterval(timer);
                console.log(animationObject[0]);
    	        rl.clearLine(process.stdout, 0);
                console.log(doneText);
            }, 5000);
        };
    
        main();
    },
    async:function(function1,function2) {
      function testAsync(){
        return new Promise((resolve,reject)=>{
            //here our function should be implemented 
            setTimeout(()=>{
                function1;
                resolve();
            ;} , 5000
          );
        });
      }
    
      async function callerFun(){
          console.log("Caller");
          await testAsync();
          function2;
      }
    
      callerFun();
    },
    //
}