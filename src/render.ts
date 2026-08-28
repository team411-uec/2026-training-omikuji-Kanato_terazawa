// 描画層 (render.ts)
// 状態を受け取って画面(DOM)に表示するだけを担当する。
// おみくじを引くロジックは omikuji.ts、ボタンと処理の連携は main.ts が持つ。

import Sortable from "sortablejs";
import type { OmikujiResult } from "./omikuji";
import { gettaskValues, randomIdxtask, randomIdxtask_div } from "./omikuji";
const resultElement = document.getElementById("result")!;
const resulttask = document.getElementById("task-result")!;

export function renderResult(result: OmikujiResult | null): void {
  // ステップ0 ではコンソールに結果が出るだけ。
  console.log(result);

  // task（ステップ1）: ここに DOM 操作を書いて、画面に結果を表示する。
  if (result !== null) {
    resultElement.textContent = `${result}`;
  } else {
    resultElement.textContent = "_";
  }
}
//タスクの選択結果表示
export function renderResulttask(result: string): void {
  if (result != undefined) {
    resulttask.textContent = `${result}`;
  } else {
    resulttask.textContent = "タスク無し！やることが無いのも寂しくない？";
  }
}

// 拡張ポイント（ステップ2以降）。必要になったら関数を足す。
//  - 履歴をリスト表示する: document.createElement で <li> を作り、<ul id="history"> に足す関数。
//  - 残りくじ枚数を表示する: omikuji.ts に残数を返す関数を足したうえで表示用の関数を足す。

// SortableJSによる表の並べ替え
const inputColumn = document.getElementById("input_column");
if (inputColumn) {
  new Sortable(inputColumn, {
    handle: "svg", // handle's selector
    animation: 150,
  });
}

//「タスクを追加」処理
export function addtask(): void {
  const brank = gettaskValues().some((task) => task.text === "");
  console.log(brank);
  console.log(gettaskValues());
  const originalDiv = document.getElementById("task_set"); //タスク入力
  const container = document.getElementById("input_column"); //タスク入力表
  if (originalDiv && container && !brank) {
    //(gettaskValues)に空欄があったらタスク追加は無効
    const clonedDiv = originalDiv.cloneNode(true) as HTMLDivElement; //要素を中身ごと丸ごと複製する (true で子要素もすべてコピー)
    clonedDiv.removeAttribute("id");
    const clonedInput = clonedDiv.querySelector("#task"); //複製した中身のinputのIDを#taskに設定
    if (clonedInput) {
      (clonedInput as HTMLInputElement).value = ""; //コピーしたinputの中身を空にする
    }
    container.prepend(clonedDiv);
  }
}

//「完了！」ボタン実装
export function donetask(): void {
  const brank = gettaskValues().some((task) => task.text === "");

  const idx = randomIdxtask_div.result;
  const selected_task = document.querySelector(
    `.input_column div:nth-child(${idx! + 1})`,
  );
  const last_task = document.querySelector(`.input_column div:nth-child(1)`);
  const finishedtasklist = document.getElementById("accordion-content");

  //完了ボタン二回目以降の連打を無視
  if (resultElement.textContent !== "_") {
    console.log("done", randomIdxtask_div.result, selected_task); //引いたタスクの番号を確認
    if (gettaskValues().length == 1 && brank == true) {
      //タスクが無い場合は無効
      console.log("タスク空欄を検知");
      resulttask.textContent = "_";
    } else {
      if (gettaskValues().length == 1 && brank == false) {
        addtask();
        finishedtasklist?.prepend(last_task!);
        resulttask.textContent = "_";
      } else {
        finishedtasklist?.prepend(selected_task!);
        resulttask.textContent = "_";
      }
    }
    const transfered_task = document.querySelector(
      ".accordion-content .input_section",
    );
    console.log("uow", transfered_task);
    transfered_task?.classList.replace("input_section", "finishedtask_section");
  }
}
