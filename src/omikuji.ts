// データ層 (omikuji.ts)
// おみくじの型と、くじの箱（データと操作関数）を定義する層。
// データとロジックだけに専念し、画面表示(DOM操作)はしない。
// CLI 版のコードをほぼそのまま再利用している。この層は完成済み。まずは読んで理解する。
// おみくじの結果を表す型（Union Type）。
// この6つの文字列以外は使えないので、打ち間違い（例: "第吉"）を防げる。

export type OmikujiResult = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶";

// 各結果を何枚ずつ箱に入れるかの比率。数値は自由に変えてよい。
//メモ　少数にしても良いがfloatで誤差が出る。影響はわからない。

export const omikujiRatios: Record<OmikujiResult, number> = {
  大吉: 5,
  中吉: 15,
  小吉: 20,
  吉: 30,
  末吉: 20,
  凶: 10,
};

//上のRecordを表形式にして、さらに枚数の累積度数をつくる
const pick_luck = Object.entries(omikujiRatios) as [OmikujiResult, number][];
let LuckRatioSum = 0;
for (let n: number = pick_luck.length - 1; n >= 0; n--) {
  LuckRatioSum = LuckRatioSum + pick_luck[n][1]; //くじ枚数の合計
}
//console.log(pick_luck.length);
for (let i = pick_luck.length - 1; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    pick_luck[i][1] = pick_luck[i][1] + pick_luck[j][1];
  }
}
console.log(pick_luck);

//全タスクをリストとして取得（内容はmemo.mdを参照）
export function getTodoValues(): string[] {
  const inputs = document.querySelectorAll<HTMLInputElement>(".todo");
  return Array.from(inputs).map((input) => input.value.trim());
  //   .filter((value) => value !== "");
}

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

  //タスクリストからランダムにタスクを選ぶ
  randomIdxTodo.result = Math.floor(Math.random() * TrueTodoValues.length);
  const drawnTodo = TrueTodoValues[randomIdxTodo.result];
  return drawnTodo;
}
// 箱の中身（引けるくじ）。このファイルの中だけで使う。
// export していないので外部からは直接触れず、下の関数を通して操作する。
let tickets: OmikujiResult[] = [];

//おみくじの処理
// 箱からランダムに1枚引いて返す。空のときは null を返す。

//重み付き抽選の実装
//なんかrandomIdxTodo（ランダムに引かれたタスクの番号）が決まったら
//1.値域をrandomIdxTodo～randomIdxTodo+1に設定
//2.大吉～凶の「割合」を合計してLuckRatioSumに代入
//3.1.の値域*LuckRatioSum/総タスク数(TrueTodoValues.length)を行う
//4.3の地域で乱数生成、運勢ごとに割り当てられた値域(上の累積度数pick_luckより)に乱数が入ったらその運勢を選択
export function drawOmikuji(): OmikujiResult {
  const brank = getTodoValues().includes("");
  const TrueTodoValues = getTodoValues().filter((value) => {
    return value != ""; //タスクを表にまとめたgetTodoValuesから空欄を抜く
  });
  let i = 0;
  if (getTodoValues().length == 1 && brank) {
    //タスクリストが空の時、無作為におみくじを引く
    i = 0;
    const randomValue = Math.random() * LuckRatioSum;
    for (const [result, threshold] of pick_luck) {
      if (randomValue <= threshold) {
        return result;
      }
    }
  } else {
    i = randomIdxTodo.result!;
    const step = LuckRatioSum / TrueTodoValues.length;
    const randomValue = i * step + Math.random() * step;
    // console.log("randomValue=", randomValue);
    for (const [result, threshold] of pick_luck) {
      // 乱数が閾値を「下回った」最初の運勢を返す
      // この構文でiやjを使わずに表を操作するfor文を書ける
      if (randomValue <= threshold) {
        return result;
      }
    }
  }
  return "凶"; // フォールバック
}

//「完了！」ボタン実装
export function donetodo(): void {
  console.log("done", randomIdxTodo.result);
  if (randomIdxTodo.result == null) {
    //タスクが無い場合は無効
    console.log("タスク空欄を検知");
  }
}
