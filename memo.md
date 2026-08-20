AIが書いた・調べたものの備忘録（AI頼りの罪悪感を軽減するため）

# github copilotに書かせた以下のコードを分解

export function getTodoValues(): string[] {
const inputs = document.querySelectorAll<HTMLInputElement>(".todo");
return Array.from(inputs).map((input) => input.value.trim());
// .filter((value) => value !== "");
}

## 目的

id="todo"のinputの入力内容を全部まとめて便利な形式のリストにしたい。
後のコマンドで、そのリストから運勢によってtodoを選ぶ。

## string[]

文字列（string）のデータだけを複数格納できる文字列の配列型。
[]で～の配列を表す。
例：const numbers: number[] = [1,2,3];でnumverだけの配列をつくる

## document.getElementById

htmlの要素をidから取得。documentは いわく「JavaScriptからHTMLの中身を操作するときの「大元（ルート）」

## document.querySelectorAll(".todo");

htmlのclassが".todo"に一致する要素をすべて取得。

## document.querySelectorAll<HTMLInputElement>(".todo");

上でもらう要素を、最初から HTMLInputElement（<input>要素）として取得する。
こうすることでTypeScriptに、もらう要素を<input>要素であると認識させ、inputのいろいろなプロパティを取得できる。
<HTMLInputElement>がないとinputとして使えない。

## Array.from(inputs)

配列inputsを本当の配列にする。
string[]はtypescript内だけに存在する型（ルール）であり、Javascriptに変換されるとき全部消えてなくなる。
※Typescriptは全部Javascriptに変換されて実行される。
これで後述のmapなどの操作が使える。

## map((input) => input.value.trim());

各入力フォームに入力されている文字（.value）を取得し、その前後の空白スペースを削除（.trim()）する。
.valueはCSSなどで指定できる属性セレクターの一個。前述の変換処理によりこの属性を使える。
ここはアロー関数であり、（https://training.team411.net/basic-programming/function/）
functionを使わずに(input)を=>の右側の処理を行う関数として定義している。
input.value.trimのinputは好きな名前でよいが、簡単のため名前をinputとしている。
↓functionを使って書いた場合
function getTrimmedValues(inputs) {
return Array.from(inputs).map(function(input) {
return input.value.trim();
});
}

以上で5行目のコード解説を終了

## container.prepend(clonedDiv);

containerとして登録した親要素の先頭に子要素としてclonedDivを追加する。

## container.appendChild(clonedDiv);

上とは逆に、最後にclonedDivを追加する。

## const entries = Object.entries(omikujiRatios);

entriesは静的メソッドで、与えられたオブジェクトが所有する、文字列をキーとした列挙可能なプロパティのキーと値の組の配列を返す。
Recordは順番を保証しないなどの制約があるけどデータなら順番があるので無理やりとる形。
