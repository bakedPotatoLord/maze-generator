<template>
  <div class="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">

import Player from "./utils/Player"
import Maze from './utils/Maze';

console.log("app run")

enum scene {
	welcome ,
	levelSelect,
	game,
}

let currScene = scene.welcome

let canvas = ref<HTMLCanvasElement| null>(null) 

const err = ():never=> {
	throw new Error()
}

onMounted(()=>{
	console.log("app mounted")
	let c = canvas.value ?? err()
	let ctx = c.getContext("2d") ?? err()
	ctx.fillStyle = "black"  
	
	c.addEventListener("click",()=>{
		c.requestFullscreen()
	})

	const maze = new Maze(20,20,20)
	const n = maze.nodes
	const player = new Player(10,10,8)
	requestAnimationFrame(draw)

	function draw(){
		if(currScene == scene.game){
			maze.draw(ctx)
			player.draw(ctx)
		}
		
	}

	window.addEventListener("keydown",(e)=>{
		player.erase(ctx)
		const walls = n.get(player.x+","+player.y)?.walls
		console.log()
		if(e.key == "w" || e.key == "ArrowUp"){
			if(!walls?.top){
				player.y -= 20
				console.log("moveUp")
			}
		}
		if(e.key == "s" || e.key == "ArrowDown"){
			if(walls?.bottom){
				player.y += 20
			}
		}
		if(e.key == "a" || e.key == "ArrowLeft"){
			if(walls?.left){
				player.x -= 20
			}
		}
		if(e.key == "d" || e.key == "ArrowRight"){
			if(!walls?.right){
				player.x += 20
			}
		}
		player.draw(ctx)
		
	})
})




</script>

<style>
	
</style>