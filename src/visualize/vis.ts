
import { default as Node } from '../Node';
 

let c = document.querySelectorAll('canvas')[0]
let ctx = c.getContext('2d')

const cw = c.width = 400
const ch = c.height = 400

let blockSize = 20


let nodes = Array((cw/blockSize)*(ch/blockSize)).fill(0).map((_el,i)=>{
  return new Node(
    (i%(cw/blockSize)*(blockSize))+(blockSize/2),
    (Math.floor(i/(cw/blockSize))*(blockSize))+(blockSize/2))
})   
//.filter((el)=>Math.hypot(el.x-200,el.y-200)< 200)

nodes.forEach(n=>{
  n.visited = false
  n.wallsTo = n.getTouchingNodes(nodes,blockSize)
})
let startingNode = nodes[0]
startingNode.isStartingNode = true

let endingNode = nodes.slice(-1)[0]
endingNode.isEndingNode = true

startingNode.visited = true
let que = [startingNode]

draw()

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
    
    ctx.clearRect(0,0,400,400)

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
  }
}




  

export {}