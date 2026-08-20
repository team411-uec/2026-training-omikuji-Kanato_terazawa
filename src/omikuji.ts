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
  大吉: 0.05,
  中吉: 0.15,
  小吉: 0.2,
  吉: 0.3,
  末吉: 0.2,
  凶: 0.1,
};
const pick_luck = Object.entries(omikujiRatios);
console.log("Omikuzi運勢取得チャレンジ", pick_luck[5][0]);

// 箱の中身（引けるくじ）。このファイルの中だけで使う。
// export していないので外部からは直接触れず、下の関数を通して操作する。
let tickets: OmikujiResult[] = [];

// 箱の中身を omikujiRatios の比率どおりに入れ直す。
//「完了！」ボタンでは使わないけど最初のくじの割り振りに要る
export function resetOmikuji(): void {
  tickets = [];
  for (const [result, count] of Object.entries(omikujiRatios)) {
    for (let i = 0; i < count; i++) {
      // Object.entries だとキーが string 扱いになるので as で元の型に戻す。
      tickets.push(result as OmikujiResult);
    }
  }
  console.log(`おみくじ箱をリセットしました。（合計 ${tickets.length} 枚）`);
  console.log(tickets);
}

// 箱からランダムに1枚引いて返す。空のときは null を返す。
export function drawOmikuji(): OmikujiResult | null {
  const randomIdx = Math.floor(Math.random() * tickets.length);
  // splice は抜き出した要素の配列を返すので、その 0 番目を取り出す。
  //const drawnTicket = tickets.splice(randomIdx, 1)[0];
  //変更！くじの枚数はここでは決めずにタスクの数で決めるので、
  // spliceによるカード削除を止めてdrawnTicketsを代替
  const drawnTicket = tickets[randomIdx];
  //console.log(tickets);
  return drawnTicket;
}

export function drawTodo(): string {
  const brank = getTodoValues().includes("");
  if (getTodoValues().length == 1 && brank) {
    console.log("タスク無し！やることが無いってのも寂しくない？");
  }
  //タスクリストから空欄を消して再度リスト出力
  const TrueTodoValues = getTodoValues().filter((value) => {
    return value != "";
  });
  //重み付き抽選の実装
  //なんか運勢が決まったら
  //1.大吉を始点としてその運勢の順番を調べる
  //2.その順番から若い順番の「割合」を全部足したものをj,その順番だけを足してないものをiとする
  //例えば「小吉」の場合(i,j)=(0.2,0.4)、大吉の場合(0,0.05)となる
  //3.大吉～凶の「割合」を合計してsumに代入
  //4.i = i*TrueTodoValues.length/sum,j=j*TrueTodoValues.length/sumを行う
  //5.地域i~jで乱数生成、そのintをとり、その番号でタスクを選ぶ

  const randomIdxTodo = Math.floor(Math.random() * TrueTodoValues.length);
  const drawnTodo = TrueTodoValues[randomIdxTodo];
  console.log(drawnTodo, randomIdxTodo, Math.random() * TrueTodoValues.length);
  console.log("タスクリスト", getTodoValues());
  console.log("タスクリスト長さ", getTodoValues().length);
  console.log("空欄抜きTodo", TrueTodoValues);
  console.log("空欄抜きTodo長さ", TrueTodoValues.length);

  return drawnTodo;
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
