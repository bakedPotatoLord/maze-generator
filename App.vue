<template>
  <div class="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import Player from "~/utils/Player";
import Maze from "~/utils/Maze";
import type Node from "~/utils/Node";
import GlobalState from "~/utils/GlobalState";

console.log("app run");

enum scene {
  welcome,
  levelSelect,
  game,
}

let currScene = scene.welcome;
let canvas = ref<HTMLCanvasElement | null>(null);

const err = (): never => {
  throw new Error();
};

let cw = 1200;
let ch = 800;
const blocksize = 20;
const numW = () => cw / blocksize;
const numH = () => ch / blocksize;

onMounted(async () => {
  console.log("app mounted");
  let c = canvas.value ?? err();
  let ctx = c.getContext("2d") ?? err();
  ctx.fillStyle = "black";

  c.addEventListener("click", () => {
    c.requestFullscreen();
  });

  const keys: any = {};
  const levelSelect = new LevelSelect();
  let welcomeMaze = new Maze(numW(), numH(), blocksize);
  let welcomeSolution: Node[] | null;

  let keyHandle: NodeJS.Timeout;

  let maze = new Maze(numW(), numH(), blocksize);
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
      welcomeMaze.reset(cw / 20, ch / 20, blocksize);
      welcomeMaze.draw(ctx);
      welcomeSolution = await bfs(
        welcomeMaze.startingNode,
        <Node>welcomeMaze.endingNode,
        welcomeMaze.nodes,
        blocksize,
        ctx,
        true,
        0
      );
      if (GlobalState.leaveWelcome){
				setupLevelSelect()
				requestAnimationFrame(draw);
				return;
			} 
      welcomeMaze.draw(ctx);
      for (let prev of <Node[]>welcomeSolution?.reverse()) {
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        if (prev.parent) ctx.lineTo(prev.parent.x, prev.parent.y);
        ctx.stroke();
        await new Promise((res) => setTimeout(res, 50));
				if (GlobalState.leaveWelcome){
					setupLevelSelect()
					requestAnimationFrame(draw);
					return
				}
      }
    }
    requestAnimationFrame(draw);
  }

  async function setupWelcome() {
    console.log("setting up welcome screen");
    c.width = cw;
    c.height = ch;
  }

  function setupLevelSelect() {
		cw = 600;
		ch = 400;
    c.width = cw
    c.height = ch
  }

  function setupGame(w: number, h: number) {
    cw = w;
    ch = h;
    console.log("setting up game screen");
    maze.reset(cw / 20, ch / 20, blocksize);
    n = maze.nodes;
    player.reset();
    currScene = scene.game;
    c.width = cw;
    c.height = ch;
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
      else if (e.key == " ") {
        const l = levelSelect.getLevel();
        setupGame(l.w, l.h);
      }
    } else if (currScene == scene.game) {
      if (e.key == " ") {
        currScene = scene.levelSelect;
        return;
      }
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
      GlobalState.leaveWelcome = true;
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
