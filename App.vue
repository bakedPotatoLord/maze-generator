<template>
  <div class="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

import Node from "./utils/Node"
import rdfs from "./utils/rdfs"
import { getEndingNode, getStartingNode, makeHexNodeMap, makeSquareNodeMap, makeTriNodeMap} from "./utils/helpers"
import bfs from "./utils/bfs"
import Player from "./utils/Player"

enum scene {
	welcome ,
	levelSelect,
	game,
}

const currScene = scene.welcome

let canvas = ref<HTMLCanvasElement>(null) 

onMounted(()=>{
	let c = canvas.value
	console.log(c)
	
	let ctx = c.getContext("2d")
	
	ctx.fillStyle = "black"
	
	// declare canvas vars
	let cw:number
	let ch:number 
	let blockSize = 20
	let numW:number
	let numH :number
	
	// declare graph algorithm vars
	let nodes:Map<string,Node>
	let startingNode:Node
	let endingNode:Node
	
	//extra vars
	let mazeExists = false

	c.addEventListener("click",()=>{
		c.requestFullscreen()
	})

	const n = setup(50,50,20,4)
	ctx.lineWidth = 1

	const player = new Player(10,10,8)
	
	function setup(width:number,heigth:number,blockSizeP:number,shape:number){
	  //set up
	  numH = heigth
	  numW = width
	  blockSize = blockSizeP
	  ch = c.height = heigth *blockSize
	  cw = c.width = width * blockSize
	  if(shape== 4){
	    nodes = makeSquareNodeMap(cw,ch,blockSize) 
	  }
	  //create start and end nodes
	  startingNode = getStartingNode(nodes)
		startingNode.isStartingNode = true
	  endingNode = getEndingNode(nodes)
	  endingNode.isEndingNode = true
	  //do the grunt work
	  rdfs(nodes,startingNode,blockSize)
	  //draw it
	  requestAnimationFrame( draw )
		return nodes
	}
	
	function draw(){

		if(currScene == scene.welcome){
			console.log("drawing welcome")
			ctx.fillStyle = "red"
			ctx.fillRect(10,10,10,10)
		}else if(currScene == scene.game){
			ctx.fillStyle  = 'white'
	  ctx.clearRect(0,0,cw,ch)
	  ctx.strokeStyle = 'black'
	  ctx.lineWidth = 3
	  ctx.fillRect(0,0,cw,ch)
	  ctx.beginPath
	  ctx.rect(1,1,cw-1,ch-1)
	  ctx.stroke()
	  //draw all node
	  nodes.forEach(el=>el.draw(ctx,blockSize))
	  //use breadth-first search because depth first will find "a" solutoion, but not "the" solutoin  
	  bfs(startingNode,endingNode,nodes,blockSize,false) 
		}
	  
	}

	n.forEach(n=>{
		n.walls ={
			left: n.wallsTo.filter(no=>no.x == n.x-20 && no.y ==n.y).length > 0 || n.x == blockSize/2,
			right: n.wallsTo.filter(no=>no.x == n.x+20 && no.y ==n.y).length>0 || n.x == cw - blockSize/2,
			top: n.wallsTo.filter(no=>no.x == n.x && no.y ==n.y-20).length>0 || n.y == blockSize/2,
			bottom: n.wallsTo.filter(no=>no.x == n.x && no.y ==n.y+20).length>0|| n.y == ch - blockSize/2,
		}
	})


	window.addEventListener("keydown",(e)=>{
		player.erase(ctx)
		console.log(n.get(player.x+","+player.y).walls)
		if(e.key == "w" || e.key == "ArrowUp"){
			if(!n.get(player.x+","+player.y).walls.top){
				player.y -= 20
				console.log("moveUp")
			}
		}
		if(e.key == "s" || e.key == "ArrowDown"){
			if(!n.get(player.x+","+player.y).walls.bottom){
				player.y += 20
			}
		}
		if(e.key == "a" || e.key == "ArrowLeft"){
			if(!n.get(player.x+","+player.y).walls.left){
				player.x -= 20
			}
		}
		if(e.key == "d" || e.key == "ArrowRight"){
			if(!n.get(player.x+","+player.y).walls.right){
				player.x += 20
			}
		}
		player.draw(ctx)
		
	})
})




</script>

<style>
	canvas{
		
	}
</style>