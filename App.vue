<template>
  <div class="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import Player from "~/utils/Player";
import Maze from "~/utils/Maze";
import type Node from "~/utils/Node";

console.log("app run");

enum scene {
  welcome,
  levelSelect,
  game,
}

let currScene = scene.levelSelect;
let canvas = ref<HTMLCanvasElement | null>(null);

const err = (): never => {
  throw new Error();
};

const cw = 600;
const ch = 400;
const blocksize = 20;
const numW = cw / blocksize;
const numH = ch / blocksize;

onMounted(async () => {
  console.log("app mounted");
  let c = canvas.value ?? err();
  let ctx = c.getContext("2d") ?? err();
  ctx.fillStyle = "black";

  c.addEventListener("click", () => {
    c.requestFullscreen();
  });

  const keys: any = {};
  const levelSelect = new LevelSelect(cw, ch);
  let welcomeMaze = new Maze(numW, numH, blocksize);
  let welcomeSolution: Node[] | null;

  let keyHandle: NodeJS.Timeout;

  let maze = new Maze(numW, numH, blocksize);
  let n = maze.nodes;
  let player = new Player(blocksize / 2, blocksize / 2, 8);
  await setupWelcome();
  requestAnimationFrame(draw);

  async function draw() {
    if (currScene == scene.game) {
      maze.draw(ctx);
      player.draw(ctx);
    } else if (currScene == scene.levelSelect) {
      ctx.fillStyle = "#2e2e2e";
      ctx.fillRect(0, 0, c.width, c.height);

      levelSelect.draw(ctx);
    } else if (currScene == scene.welcome) {
      welcomeMaze.reset();
      welcomeMaze.draw(ctx);
      welcomeSolution = await bfs(
        welcomeMaze.startingNode,
        <Node>welcomeMaze.endingNode,
        welcomeMaze.nodes,
        blocksize,
        ctx,
        true,
        10
      );
      welcomeMaze.draw(ctx);
      for (let prev of <Node[]>welcomeSolution?.reverse()) {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        if (prev.parent) ctx.lineTo(prev.parent.x, prev.parent.y);
        ctx.stroke();
        await new Promise((res) => setTimeout(res, 50));
      }
    }
    requestAnimationFrame(draw);
  }

  async function setupWelcome() {
    console.log("setting up welcome screen");
    c.width = cw;
    c.height = ch;
  }

  function setupGame() {
    console.log("setting up game screen");
    currScene = scene.game;
    maze.reset();
    n = maze.nodes;
    player.reset();
  }

  function keyHandler() {
    if (currScene == scene.game) {
      player.erase(ctx);
      const walls = n.get(player.x + "," + player.y)?.walls;
      if (keys["w"] || keys["ArrowUp"]) {
        if (!walls?.top) {
          player.y -= 20;
          console.log("moveUp");
        }
      }
      if (keys["s"] || keys["ArrowDown"]) {
        if (!walls?.bottom) {
          player.y += 20;
        }
      }
      if (keys["a"] || keys["ArrowLeft"]) {
        if (!walls?.left) {
          player.x -= 20;
        }
      }
      if (keys["d"] || keys["ArrowRight"]) {
        if (!walls?.right) {
          player.x += 20;
        }
      }
      player.draw(ctx);
    }
  }

  window.addEventListener("keydown", (e) => {
    if (currScene == scene.welcome) {
			
    } else if (currScene == scene.levelSelect) {
      if (["ArrowUp", "w"].includes(e.key)) levelSelect.moveUp();
      else if (["ArrowDown", "s"].includes(e.key)) levelSelect.moveDown();
      else if (["ArrowLeft", "a"].includes(e.key)) levelSelect.moveLeft();
      else if (["ArrowRight", "d"].includes(e.key)) levelSelect.moveRight();
    } else if (currScene == scene.game) {
      keys[e.key] = true;
      keyHandler();
      setTimeout(() => {
        clearInterval(keyHandle);
        keyHandle = setInterval(keyHandler, 1000);
      }, 150);
    }
  });

  window.addEventListener("keyup", (e) => {
    if (currScene == scene.welcome) {
      currScene = scene.levelSelect;
    } else if (currScene == scene.game) {
      keys[e.key] = false;
      clearInterval(keyHandle);
    }
  });
});
</script>

<style>
canvas {
  border: 4px solid black;
}
</style>
