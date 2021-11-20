const fs = require("fs");

// 演算子名、関数名をキーに、その引数の長さと、処理を記述する。
var functions = {
  // 加算
  "+": {
    length: 2,
    body: params => params[1] + params[0]
  },
  // 減算
  "-": {
    length: 2,
    body: params => params[1] - params[0]
  },
  // 掛け算
  "*": {
    length: 2,
    body: params => params[1] * params[0]
  },
  // 割り算
  "/": {
    length: 2,
    body: params => params[1] / params[0]
  },
  // 余り
  "%": {
    length: 2,
    body: params => params[1] % params[0]
  },
  // 累乗
  "**": {
    length: 2,
    body: params => params[1] ** params[0]
  },
  // 等しい
  "==": {
    length: 2,
    body: params => params[1] == params[0]
  },
  // 等しくない
  "!=": {
    length: 2,
    body: params => params[1] != params[0]
  },
  // 小なり
  "<": {
    length: 2,
    body: params => params[1] < params[0]
  },
  // 大なり
  ">": {
    length: 2,
    body: params => params[1] > params[0]
  },
  // NOT
  "!": {
    length: 1,
    body: params => !params[0]
  },
  // 標準出力
  "print": {
    length: 1,
    body: params => console.log("stdout", params[0])
  }
};

// 中置記法をパースしてポーランド記法に変換する。
function toPN(exp) {
  // 演算子を優先度の昇順で並べる。
  var opes = [
    [";"],
    ["="],
    ["==", "!="],
    ["<", ">"],
    ["+", "-"],
    ["*", "/", "%"],
    ["**"],
    ["!"]
  ];

  // 右結合する演算子
  var right_opes = ["=", "**", "!"];
  // 単項演算子
  var u_opes = ["!", ";"];

  for (var i = 0; i < opes.length; i++) {
    // opes[i]の演算子が現れるか調べる。iが小さい演算子ほど優先順位が低い。
    var ope_dis = []; //演算子が現れるまでの距離
    for (var j = 0; j < opes[i].length; j++) {
      if (right_opes.indexOf(opes[i][j]) == -1) {
        // 右から調べることで、左結合になる。   
        var index = exp.lastIndexOf(opes[i][j]);
        ope_dis.push(exp.length - 1 - index);
      } else {
        // 左から調べることで、右結合になる。
        var index = exp.indexOf(opes[i][j]);
        if (index == -1) {
          ope_dis.push(exp.length);
        } else {
          ope_dis.push(index);
        }
      }
    }

    // 同じ優先順位の演算子の中で、見つかるまでの距離が一番小さいものを選択。
    var min_dis = Math.min(...ope_dis);

    // min_disがexp.lengthだったら、今見ている優先度では演算子が見つからなかったので、処理しない。
    if (min_dis < exp.length) {
      // 見つかるまでの距離が小さい演算子を取得
      var k = ope_dis.indexOf(min_dis);
      var operator = opes[i][k];

      // 演算子が見つかった位置を計算
      var operator_index;
      if (right_opes.indexOf(operator) == -1) {
        operator_index = exp.length - 1 - min_dis;
      } else {
        operator_index = min_dis;
      }

      if (u_opes.indexOf(operator) == -1 || right_opes.indexOf(operator) == -1) {
        // 二項演算子か単項演算子の左結合なら、演算子を左に移動させる。
        var res = [];
        res.push(operator); //演算子をpushする。
        res.push(...toPN(exp.slice(operator_index + 1, exp.length))); // 同様に演算子より右側の式をパースする。
        res.push(...toPN(exp.slice(0, operator_index))); // 演算子より左側の式をパースしてポーランド記法に直す。

        return res;
      } else {
        // 単項演算子かつ右結合なら、演算子を移動させない。
        var res = [];
        res.push(...toPN(exp.slice(0, operator_index))); // 演算子より左側の式をパースしてポーランド記法に直す。
        res.push(operator); //演算子をpushする。
        res.push(...toPN(exp.slice(operator_index + 1, exp.length))); // 同様に演算子より右側の式をパースする。

        return res;
      }
    }
  }

  // 演算子が一つも見つからなかったら、終了と判断してそのまま式をリターン。
  return exp;
}

// 丸括弧の含まれる中置記法を解析する。
function parse(exp) {
  // 処理用スタック
  var stack = [];

  // 式を左から順番に見ていく。
  for (var i = 0; i < exp.length; i++) {
    // 現在見ている要素
    var e = exp[i];

    if (e != ")") {
      // 閉じ括弧が現れるまでは、そのままpushする。
      stack.push(e);
    } else {
      // 閉じ括弧が現れたら、その括弧の中身をパースしてから、スタックに再追加する。
      //開き括弧のインデックス
      var index = stack.lastIndexOf("(");

      // 括弧の中身を取り出す
      var ex = stack.slice(index + 1, stack.length);
      // スタックから括弧を削除する。
      stack = stack.slice(0, index);
      // 括弧の中身をパースしてから、スタックにpushする。
      stack.push(toPN(ex));
    }
  }

  // パースしてからリターン
  return toPN(stack);
}

// 多次元配列を一次元配列に変換
function flatten(list) {
  var res = [];
  for (var i = 0; i < list.length; i++) {
    if (Array.isArray(list[i])) {
      res.push(...flatten(list[i]));
    } else {
      res.push(list[i]);
    }
  }
  return res;
}


// 実行環境、関数定義を受け取る
function Env(func) {
  // ローカル変数
  this.locals = {};
  // 関数定義
  this.func = func;
  // 処理用スタック
  this.stack = [];
};
Env.prototype = {
  // ソースコードを受け取って実行する。
  execute: function(src) {
    // 字句で区切る。改行はセミコロンとする。
    var words = src.split("\n").join(" ; ").split("(").join(" ( ").split(")").join(" ) ").split(" ").filter(x => x.length > 0);
    // ポーランド記法に変換
    var rpn_list = flatten(parse(words));
    //逆ポーランド記法に変換
    rpn_list.reverse();

    console.log(rpn_list);

    // 式を左から順番に見ていく。
    for (var i = 0; i < rpn_list.length; i++) {
      // 現在見ている要素
      var e = rpn_list[i];

      if (e in this.func) {
        // 要素が関数名だったら、その関数名に従って計算する。

        // 引数の数だけ、スタックから取り出す。
        var args = [];
        for (var j = 0; j < this.func[e].length; j++) {
          var top = this.stack.pop();
          args.push(top in this.locals ? this.locals[top] : top);
        }

        // 引数を元に計算し、その結果をスタックにpushする。
        this.stack.push(this.func[e].body(args));

      } else if (e == "=") {
        // 代入式が現れた場合
        // 値を取り出す。
        var value = this.stack.pop();
        // ローカル変数に代入する
        this.locals[this.stack.pop()] = value;
        // 式なので、値を返す。
        this.stack.push(value);
      } else if (e == "if" || e == "while") {
        // if文かwhile文が現れた場合、条件に合致しなければend_ifおよびend_whileまで処理を飛ばす。
        var condition = this.stack.pop();
        if (!condition) {
          while (("end_" + e) != rpn_list[++i]);
        }

      } else if (e == ";" || e == "end_if") {
        // 何もしない
      } else if (e == "end_while") {
        // 前回whileまで戻す。
        while (--i >= 0 && "while" != rpn_list[i]);
        // さらにその前のセミコロンまで戻す。
        while (--i >= 0 && ";" != rpn_list[i]);

      } else if (/^([0-9]|[1-9][0-9]+)(|\.[0-9]|\.[0-9]+[1-9])$/.test(e)) {
        // 数値リテラルを正規表現で判断して、数値ならスタックに入れる。
        this.stack.push(parseFloat(e));
      } else {
        // それ以外なら、そのまま変数名をpushする。
        this.stack.push(e);
      }
    }

    // スタックから値を取り出してreturn
    return this.stack.pop();
  }
};

var srcfile = fs.readFileSync( "test.clii" );

var src = "" + srcfile;
console.log(src);

var env = new Env(functions);
env.execute(src);

