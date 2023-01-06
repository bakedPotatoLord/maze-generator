import { getEndingNode, getStartingNode, makeSquareNodeMap } from '../helpers';
import Node from '../Node';

const c = document.querySelector('canvas')
const ctx = c.getContext('2d')
const state = document.querySelector('#state')

// create canvas vars
let cw = c.width = 200
let ch = c.height = 200
let blockSize = 20

// initialize helper variables
let form = document.forms[0]
let nodes:Map<string,Node>
let startingNode:Node
let que:Node[] = []
let drawingCompleted = true

function setup(){
  nodes = makeSquareNodeMap(cw,ch,blockSize)

  nodes.forEach(n=>{
    n.visited = false
    n.wallsTo = n.getTouchingNodes(nodes,blockSize)
  })
  //get starting node
  startingNode = getStartingNode(nodes)
  startingNode.isStartingNode = true
  //get ending node
  getEndingNode(nodes).isEndingNode = true
  //setup que
  startingNode.visited = true
  que = [startingNode]
}

function draw(){
  let current = que.shift()
  let unvisited = current
  .getTouchingNodes(nodes,blockSize)
  .filter((el)=>!el.visited)
  
  if(unvisited.length >0){
    que.push(current)
    let chosen = unvisited[Math.floor(Math.random()*unvisited.length)];
    current.wallsTo = current.wallsTo.filter((el)=>
      el != chosen
    )
    chosen.wallsTo = chosen.wallsTo.filter((el)=>
      el != current
    )
    chosen.visited = true
    que.unshift(chosen)
    
    ctx.clearRect(0,0,cw,ch)
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,cw,ch)

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
    state.innerHTML = 'Generation Complete'
  }
}

form.onsubmit =e=>{
  e.preventDefault()
  state.innerHTML = 'Generating ...'

  let data = new FormData(form)
  cw = c.width = parseInt(data.get('size').toString())*blockSize
  ch = c.height = parseInt(data.get('size').toString())*blockSize

  if(drawingCompleted){
    setup()
    draw()
    drawingCompleted =false
  }else{
    alert('Wait for visualization to complete before starting a new one. To abort drawing, reload the page.')
  }
}
