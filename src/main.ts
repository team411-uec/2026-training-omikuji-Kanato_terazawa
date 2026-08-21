// イベント層 (main.ts)
// クリックされた時の処理とボタンを結びつける。
// おみくじ箱を用意し、ボタンのクリックで reset / draw を呼び、結果を描画層に渡す。
// この層は完成済み（ステップ1で render.ts を実装すれば動く）。

import {
  //resetOmikuji,
  drawOmikuji,
  drawTodo,
  type OmikujiResult,
} from "./omikuji";
import { renderResult, renderResultTodo } from "./render";
import { addTodo } from "./omikuji";

export const omikujiState = {
  result: null as OmikujiResult | null,
};

function main(): void {
  // おみくじ箱を用意する（1回呼ぶと、くじが入った状態になる）。
  //resetOmikuji();

  const drawButton = document.getElementById("draw-button");
  const doneButton = document.getElementById("done-button");
  const addButton = document.getElementById("add-button");

  drawButton?.addEventListener("click", () => {
    // render.ts の renderResult を実装すると、ここで画面に結果が出る（ステップ1）。

    renderResultTodo(drawTodo());
    renderResult(drawOmikuji());
  });

  doneButton?.addEventListener("click", () => {
    // resetOmikuji();
    // 表示を初期状態（結果なし）に戻す。
    renderResult(null);
  });

  addButton?.addEventListener("click", () => {
    console.log("add-buttonの押下を検知");
    addTodo();
  });
}

main();
