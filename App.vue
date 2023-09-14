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

let currScene = scene.welcome

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

	let welcomeMaze: Maze
	let welcomeSolution: Node[] | null

	const maze = new Maze(20, 20, 20)
	const n = maze.nodes
	const player = new Player(10, 10, 8)
	await setupWelcome()
	requestAnimationFrame(draw)

	async function draw() {
		if (currScene == scene.game) {
			maze.draw(ctx)
			player.draw(ctx)
		} else if (currScene == scene.welcome) {

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
			await new Promise(res => setTimeout(res, 1000))
			welcomeMaze.draw(ctx)
			for(let prev of <Node[]>welcomeSolution?.reverse()){
				ctx.strokeStyle = 'green'
				ctx.beginPath()
				ctx.moveTo(prev.x, prev.y)
				if (prev.parent)
					ctx.lineTo(prev.parent.x, prev.parent.y)
				ctx.stroke()
				await new Promise(res => setTimeout(res, 100))

			}
			

		}
		requestAnimationFrame(draw)
	}

	async function setupWelcome() {
		console.log("setting up")
		c.width = 400
		c.height = 400


	}

	window.addEventListener("keydown", (e) => {
		player.erase(ctx)
		const walls = n.get(player.x + "," + player.y)?.walls
		console.log()
		if (e.key == "w" || e.key == "ArrowUp") {
			if (!walls?.top) {
				player.y -= 20
				console.log("moveUp")
			}
		}
		if (e.key == "s" || e.key == "ArrowDown") {
			if (walls?.bottom) {
				player.y += 20
			}
		}
		if (e.key == "a" || e.key == "ArrowLeft") {
			if (walls?.left) {
				player.x -= 20
			}
		}
		if (e.key == "d" || e.key == "ArrowRight") {
			if (!walls?.right) {
				player.x += 20
			}
		}
		player.draw(ctx)

	})
})




</script>

<style></style>