// CONSTANT
const { width: wScreen, height: hScreen } = screen;

const CELL_SIZE = 25;
const COLS = Math.floor(wScreen / CELL_SIZE) - 1;
const ROWS = Math.floor(hScreen / CELL_SIZE) - 1;
const ZONE_SIZE = 9;
const WINNER_CODE = 5;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Board {
  constructor() {
    ctx.canvas.width = COLS * CELL_SIZE;
    ctx.canvas.height = ROWS * CELL_SIZE;
    this.grid = this.generalWhiteBoard();
    this.player = 1;
    this.end = false;
  }
  generalWhiteBoard() {
    return Array.from({ length: ROWS }).map(() => Array(COLS).fill(0));
  }

  drawCell(col, row) {
    ctx.fillStyle = "white";
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = "#ddd";
    ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    if ([1, 2].includes(this.grid[row][col])) {
      ctx.fillStyle = this.grid[row][col] === 1 ? "red" : "green";
      ctx.font = "22px Poppins";
      ctx.textAlign = "center";
      ctx.fillText(
        this.grid[row][col] === 1 ? "X" : "O",
        col * CELL_SIZE + CELL_SIZE / 2,
        row * CELL_SIZE + (CELL_SIZE + CELL_SIZE / 2) / 2
      );
    }
  }

  drawBoard() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.drawCell(col, row);
      }
    }
  }

  handleWinner(colPos, rowPos) {
    const flag = [0, 0, 0, 0];

    const zonePos = {
      x: colPos - 4,
      y: rowPos - 4,
    };

    for (let i = 0; i < ZONE_SIZE; i++) {
      if (
        zonePos.y + i >= 0 &&
        zonePos.y + i < ROWS &&
        zonePos.x + i >= 0 &&
        zonePos.x + i < COLS
      ) {
        if (this.grid[i + zonePos.y][i + zonePos.x] === this.player) {
          flag[0]++;
        }
      }

      if (zonePos.y + i >= 0 && zonePos.y + i < ROWS) {
        if (this.grid[zonePos.y + i][colPos] === this.player) {
          flag[1]++;
        }
      }

      if (zonePos.x + i >= 0 && zonePos.x + i < COLS) {
        if (this.grid[rowPos][zonePos.x + i] === this.player) {
          flag[2]++;
        }
      }

      if (
        zonePos.y + i >= 0 &&
        zonePos.y + i < ROWS &&
        zonePos.x + 8 - i >= 0 &&
        zonePos.x + 8 - i < COLS
      ) {
        if (this.grid[zonePos.y + i][zonePos.x + 8 - i] === this.player) {
          flag[3]++;
        }
      }
    }
    return flag.includes(5);
  }
}

const board = new Board();
board.drawBoard();

canvas.addEventListener("click", (ev) => {
  if (board.end) return;
  const mouseX = ev.pageX - canvas.offsetLeft;
  const mouseY = ev.pageY;
  const col = Math.floor(mouseX / CELL_SIZE);
  const row = Math.floor(mouseY / CELL_SIZE);
  if (!board.grid[row][col]) {
    board.grid[row][col] = board.player;
    board.drawCell(col, row);
    board.end = board.handleWinner(col, row);
    if (board.end) {
      const winnerBox = document.getElementById("winner-box");
      if (winnerBox) {
        winnerBox.style.display = "flex";
        winnerBox.querySelector(
          "#winner-content"
        ).innerHTML = `Player ${board.player} winner`;
        winnerBox.querySelector("#btn-reset")?.addEventListener("click", () => {
          board.grid = board.generalWhiteBoard();
          board.end = false;
          board.player = 1;
          board.drawBoard();
          winnerBox.style.display = "none";
        });
      }
    } else {
      board.player = board.player === 1 ? 2 : 1;
    }
  }
});
