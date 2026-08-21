// データ層 (omikuji.ts)
// おみくじの型と、くじの箱（データと操作関数）を定義する層。
// データとロジックだけに専念し、画面表示(DOM操作)はしない。
// CLI 版のコードをほぼそのまま再利用している。この層は完成済み。まずは読んで理解する。

// おみくじの結果を表す型（Union Type）。
// この6つの文字列以外は使えないので、打ち間違い（例: "第吉"）を防げる。

export type OmikujiResult = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶";

// 各結果を何枚ずつ箱に入れるかの比率。数値は自由に変えてよい。
//下記の変更(splice削除)により運勢の比率となった

export const omikujiRatios: Record<OmikujiResult, number> = {
  大吉: 5,
  中吉: 15,
  小吉: 20,
  吉: 30,
  末吉: 20,
  凶: 10,
};

//修正8/21によりこのRecordから値域を作る必要が出てきた
//下記の運勢抽選で使う部品たち
const pick_luck = Object.entries(omikujiRatios) as [OmikujiResult, number][];
let LuckRatioSum = 0;
for (let n: number = pick_luck.length - 1; n >= 0; n--) {
  LuckRatioSum = LuckRatioSum + pick_luck[n][1];
}
console.log(pick_luck.length);
for (let i = pick_luck.length - 1; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    pick_luck[i][1] = pick_luck[i][1] + pick_luck[j][1];
  }
}
console.log(pick_luck);

console.log("LuckRatioSum=", LuckRatioSum);
//    for (let i = 0; i < count; i++) {
//console.log("Omikuzi運勢取得チャレンジ", pick_luck[5][0]);
//const Luck_Index = Object.keys(omikujiRatios).indexOf("中吉");
//console.log("Omikuzi運勢順番取得チャレンジ", Luck_Index);
//console.log("Omikuzi運勢確率取得チャレンジ", pick_luck[Luck_Index][1]);

//引いたタスクの番号をこの箱に入れてエクスポート
export const randomIdxTodo: { result: number | null } = {
  result: null!,
};

export function drawTodo(): string {
  const brank = getTodoValues().includes("");
  if (getTodoValues().length == 1 && brank) {
    console.log("タスク無し！やることが無いってのも寂しくない？");
  }
  //タスクリストから空欄を消して再度リスト出力

  const TrueTodoValues = getTodoValues().filter((value) => {
    return value != "";
  });
  //重み付き抽選の実装※大規模改修！！！

  randomIdxTodo.result = Math.floor(Math.random() * TrueTodoValues.length);
  const drawnTodo = TrueTodoValues[randomIdxTodo.result];
  //console.log(
  //  "drawnTodo, randomIdxTodo.result",
  //  drawnTodo,
  //  randomIdxTodo.result,
  //);
  return drawnTodo;
}
// 箱の中身（引けるくじ）。このファイルの中だけで使う。
// export していないので外部からは直接触れず、下の関数を通して操作する。
let tickets: OmikujiResult[] = [];

// 箱の中身を omikujiRatios の比率どおりに入れ直す。

//「完了！」ボタンでは使わないけど最初のくじの割り振りに要る
//修正！完璧にいらんくなった
//export function resetOmikuji(): void {
//  tickets = [];
//  for (const [result, count] of Object.entries(omikujiRatios)) {
//    for (let i = 0; i < count; i++) {
//      // Object.entries だとキーが string 扱いになるので as で元の型に戻す。
//      tickets.push(result as OmikujiResult);
//    }
//  }
//  console.log(`おみくじ箱をリセットしました。（合計 ${tickets.length} 枚）`);
//  console.log(tickets);
//}

//おみくじの処理
// 箱からランダムに1枚引いて返す。空のときは null を返す。

//重み付き抽選の実装
//なんかrandomIdxTodoが決まったら
//1.値域をrandomIdxTodo～randomIdxTodo+1に設定
//2.大吉～凶の「割合」を合計してLuckRatioSumに代入
//3.1.の値域*LuckRatioSum/総タスク数(t)を行う
//4.3の地域で乱数生成、運勢ごとに割り当てられた値域に乱数が入ったらその運勢を選択
export function drawOmikuji(): OmikujiResult {
  const brank = getTodoValues().includes("");
  const TrueTodoValues = getTodoValues().filter((value) => {
    return value != "";
  });
  let i = 0;
  let pick_luck_resultIdx = 0;
  if (getTodoValues().length == 1 && brank) {
    i = 0;
  } else {
    i = randomIdxTodo.result!;
    const step = LuckRatioSum / TrueTodoValues.length;
    const randomValue = i * step + Math.random() * step;
    // console.log("randomValue=", randomValue);
    for (const [result, threshold] of pick_luck) {
      // 乱数が閾値を「下回った」最初の運勢を返す
      if (randomValue <= threshold) {
        return result;
      }
    }
    console.log("end", pick_luck_resultIdx);
  }
  return "凶"; // フォールバック
}

// 拡張ポイント（ステップ2以降）。必要になったら足す。
//  - 残りくじ枚数を出す: tickets.length を返す関数をこのファイルに足す（tickets は外から読めない）。

//下のgetTodoValuesはGithub Copilotにより生成
//修正前： const inputs = document.querySelectorAll<HTMLInputElement>(".todo");
//const values = Array.from(inputs).map((input) => input.value);

//全タスクをリストとして取得（内容はmemo.mdを参照）
export function getTodoValues(): string[] {
  const inputs = document.querySelectorAll<HTMLInputElement>(".todo");
  return Array.from(inputs).map((input) => input.value.trim());
  //   .filter((value) => value !== "");
}
//タスクを追加ボタン
//ボタンを押すと空白の欄が生える
export function addTodo(): void {
  console.log(getTodoValues());
  const brank = getTodoValues().includes(""); //getTodoValuesに空欄があったらタスク追加は無効
  console.log(brank);
  const originalDiv = document.getElementById("todo_set");
  const container = document.getElementById("input_column");
  if (originalDiv && container && !brank) {
    //要素を中身ごと丸ごと複製する (true で子要素もすべてコピー)
    const clonedDiv = originalDiv.cloneNode(true) as HTMLDivElement;
    clonedDiv.removeAttribute("id");

    // 必要に応じて、複製した中身のinputのIDも削除・変更する
    const clonedInput = clonedDiv.querySelector("#todo");
    if (clonedInput) {
      //clonedInput.removeAttribute("#todo");
      // (任意) コピーしたinputの中身を空にする場合
      (clonedInput as HTMLInputElement).value = "";
    }
    container.prepend(clonedDiv);
  }
}
