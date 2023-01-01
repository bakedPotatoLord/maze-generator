import { makeNodeMap } from '../helpers';
import Node from '../Node';

let c = document.querySelector('canvas')
let ctx = c.getContext('2d')

let cw = c.width = 200
let ch = c.height = 200

let blockSize = 20

let form = document.forms[0]

let nodes:Map<string,Node>

let startingNode:Node
let endingNode:Node

let que:Node[]

let drawingCompleted = true

function setup(){
  
  nodes = makeNodeMap(cw,ch,blockSize)

  nodes.forEach(n=>{
    n.visited = false
    n.wallsTo = n.getTouchingNodes(nodes,blockSize)
  })
  startingNode = Array.from(nodes.entries())[0][1]
  startingNode.isStartingNode = true
  
  endingNode = Array.from(nodes.entries())
  .slice(-1)[0][1]
  
  endingNode.isEndingNode = true
  startingNode.visited = true
  que = [startingNode]
}



function draw(){

  let current = que.shift()
  let unvisited = current
  .getTouchingNodes(nodes,blockSize)
  .filter((el)=>!el.visited)
  let chosen:Node
  
  if(unvisited.length >0){
    que.push(current)
    chosen = unvisited[Math.floor(Math.random()*unvisited.length)];
    current.wallsTo = current.wallsTo.filter((el)=>
      el != chosen
    )
    chosen.wallsTo = chosen.wallsTo.filter((el)=>
      el != current
    )
    chosen.visited = true
    que.unshift(chosen)
    
    ctx.clearRect(0,0,cw,ch)

    ctx.strokeStyle = 'red'
    ctx.lineWidth= 4
    ctx.beginPath()
    ctx.moveTo(current.x,current.y)
    ctx.lineTo(chosen.x,chosen.y)
    ctx.stroke()
  
    ctx.lineWidth = 0.5
    nodes.forEach(n=>n.draw(ctx,blockSize))
  } 

  if(que.length > 0){
    requestAnimationFrame(draw)
  }else{
    drawingCompleted = true
  }
}

form.onsubmit =e=>{
  e.preventDefault()
  if(drawingCompleted){
    setup()
    draw()
    drawingCompleted =false
  }else{
    alert('Wait for visualization to complete before starting a new one. To abort drawing, reload the page.')
  }
}

document.querySelector('input')
.onchange = ()=>{
  let data = new FormData(form)
  cw = c.width = parseInt(data.get('size').toString())*blockSize
  ch = c.height = parseInt(data.get('size').toString())*blockSize
}
