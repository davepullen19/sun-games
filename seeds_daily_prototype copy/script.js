
const startingState = [23, 0, 0, 0, 0, 0, 0, 1];
let state = [...startingState];
let movesLeft = 5;

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("reset");

function render() {
  board.innerHTML = "";

  const radius = 140;
  const center = 180;

  state.forEach((value, index) => {
    const angle = (Math.PI * 2 * index) / state.length - Math.PI / 2;

    const x = center + radius * Math.cos(angle) - 36;
    const y = center + radius * Math.sin(angle) - 36;

    const node = document.createElement("div");
    node.className = "node";
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    node.innerHTML = `<div class="seed-count">${value}</div>`;

    node.addEventListener("click", () => move(index));

    board.appendChild(node);
  });

  movesEl.textContent = movesLeft;
}

function move(index) {
  if (movesLeft <= 0) return;

  let seeds = state[index];

  if (seeds === 0) return;

  state[index] = 0;

  let current = index;

  while (seeds > 0) {
    current = (current + 1) % state.length;
    state[current]++;
    seeds--;
  }

  movesLeft--;

  render();
  checkWin();
}

function checkWin() {
  const win = state.every(v => v === 3);

  if (win) {
    messageEl.textContent = "Perfect solve.";
    return;
  }

  if (movesLeft === 0) {
    messageEl.textContent = "No moves left. Try again.";
  } else {
    messageEl.textContent = "";
  }
}

resetBtn.addEventListener("click", () => {
  state = [...startingState];
  movesLeft = 5;
  messageEl.textContent = "";
  render();
});

render();
