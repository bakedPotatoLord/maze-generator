<template>
	<div class="canvasContainer">
		<canvas ref="canvas"></canvas>
	</div>
</template>

<script setup lang="ts">

import Player from "~/utils/Player"
import Maze from '~/utils/Maze';
import type Node from '~/utils/Node'

console.log("app run")

enum scene {
	welcome,
	levelSelect,
	game,
}

let currScene = scene.game

let canvas = ref<HTMLCanvasElement | null>(null)

const err = (): never => {
	throw new Error()
}

onMounted(async () => {
	console.log("app mounted")
	let c = canvas.value ?? err()
	let ctx = c.getContext("2d") ?? err()
	ctx.fillStyle = "black"

	c.addEventListener("click", () => {
		c.requestFullscreen()
	})

	const keys:any = {}


	let welcomeMaze: Maze
	let welcomeSolution: Node[] | null

	let keyHandle: NodeJS.Timeout

	let maze = new Maze(20, 20, 20)
	let n = maze.nodes
	let player = new Player(10, 10, 8)
	await setupWelcome()
	requestAnimationFrame(draw)

	async function draw() {
		if (currScene == scene.game) {
			maze.draw(ctx)
			player.draw(ctx)
		}else if (currScene == scene.levelSelect) {
			ctx.fillRect(0, 0, c.width, c.height)	
		}else if (currScene == scene.welcome) {

			welcomeMaze = new Maze(20, 20, 20)
			
			welcomeMaze.draw(ctx)
			welcomeSolution = await bfs(
				welcomeMaze.startingNode,
				<Node>welcomeMaze.endingNode,
				welcomeMaze.nodes,
				20,
				ctx,
				true,
				10
			)
			//await new Promise(res => setTimeout(res, 1000))
			welcomeMaze.draw(ctx)
			for(let prev of <Node[]>welcomeSolution?.reverse()){
				ctx.strokeStyle = 'green'
				ctx.beginPath()
				ctx.moveTo(prev.x, prev.y)
				if (prev.parent)
					ctx.lineTo(prev.parent.x, prev.parent.y)
				ctx.stroke()
				await new Promise(res => setTimeout(res, 50))
			}
		}
		requestAnimationFrame(draw)
	}

	async function setupWelcome() {
		console.log("setting up welcome screen" )
		c.width = 400
		c.height = 400
	}

	function setupGame() {
		console.log("setting up game screen" )
		currScene = scene.game
		maze = new Maze(20, 20, 20)
		n = maze.nodes
		player.reset()
	}


	function keyHandler() {
		if(currScene == scene.welcome){
			
		}else if(currScene == scene.game){
			player.erase(ctx)
			const walls = n.get(player.x + "," + player.y)?.walls
			if (keys["w"] || keys["ArrowUp"]) {
				if (!walls?.top) {
					player.y -= 20
					console.log("moveUp")
				}
			}
			if (keys["s"] || keys["ArrowDown"]) {
				if (!walls?.bottom) {
					player.y += 20
				}
			}
			if (keys["a"] || keys["ArrowLeft"]) {
				if (!walls?.left) {
					player.x -= 20
				}
			}
			if (keys["d"] || keys["ArrowRight"]) {
				if (!walls?.right) {
					player.x += 20
				}
			}
			player.draw(ctx)
		}
	}



	window.addEventListener("keydown", (e) => {
		keys[e.key] = true
		keyHandler()
		setTimeout(() => {
			clearInterval(keyHandle)
			keyHandle = setInterval(keyHandler,1000)
		},150)
	})

	window.addEventListener("keyup", (e) => {
		keys[e.key] = false
		clearInterval(keyHandle)
	})
})

</script>

<style>
canvas{
	border: 4px solid black
}
</style>