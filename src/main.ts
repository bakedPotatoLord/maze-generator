import Node from "./Node"
import rdfs from "./rdfs"
import { getEndingNode, getStartingNode, makeHexNodeMap, makeSquareNodeMap} from "./helpers"
import bfs from "./bfs"


let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let state = <HTMLParagraphElement>document.querySelector('#state')
let mazeOptions = <HTMLDivElement>document.querySelector('.mazeOptions')

ctx.fillStyle = "black"

// declare canvas vars
let cw:number
let ch:number 
let blockSize:number
let numW:number
let numH :number

// declare graph algorithm vars
let nodes:Map<string,Node>
let startingNode:Node
let endingNode:Node

//extra vars
let mazeExists = false

function setup(width:number,heigth:number,blockSizeP:number,shape:number){
  //set up
  numH = heigth
  numW = width
  blockSize = blockSizeP
  ch = c.height = heigth *blockSize
  cw = c.width = width * blockSize
  if(shape== 4){
    nodes = makeSquareNodeMap(cw,ch,blockSize) 
  }else if(shape == 6){

    nodes = makeHexNodeMap(cw,ch,blockSize)
    ch = c.height = (heigth) * blockSize * (Math.sqrt(3)/2)
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
}

function draw(){
  ctx.fillStyle  = 'white'
  ctx.clearRect(0,0,cw,ch)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.fillRect(0,0,cw,ch)
  ctx.beginPath
  ctx.rect(1,1,cw-1,ch-1)
  ctx.stroke()
  //draw all node
  nodes.forEach(el=>el.draw(ctx,blockSize))
  //use breadth-first search because depth first will find "a" solutoion, but not "the" solutoin  
  bfs(startingNode,endingNode,nodes,blockSize,false) 

  
  if(startingNode.type ==6){
    ctx.save()
      drawHexBorder('x')
      if(numH%2 == 0){
        ctx.translate(0,(ch)- blockSize - 2)
      }else{
        ctx.translate(-blockSize/2,(ch)- blockSize -2)
      }
      drawHexBorder('x',true)
    ctx.restore()

    ctx.save()
      drawHexBorder('y')
      ctx.translate(cw-blockSize,0)
      drawHexBorder('y',true)
    ctx.restore()
  }
  
  
  mazeExists = true
  state.innerHTML = ''
  mazeOptions.hidden = false
}

function drawHexBorder(axis:'x'|'y', flip?:boolean){

  let wallLength = (blockSize/2)* (1 / Math.cos(Math.PI/6))
  let xDist = blockSize / 2
  let yDist = blockSize/(2 * Math.sqrt(3))
  
  let x= blockSize/2
  let y = blockSize/4
  ctx.beginPath()
  ctx.moveTo(x,y)
  if(axis == 'x'){
    x=0
    y= blockSize/2
    ctx.moveTo(x,y)
    let i = flip?1:0 
    while(x < cw+blockSize){
      ctx.lineTo(x,y)
      x+=xDist
      y+= (i%2==0)?-yDist:yDist
      i++
    }
  }else{
    let i =flip?2:0 
    while(y < ch-yDist*4){
      if(i%4 == 0){
        x+= -xDist
        y+= yDist
      }else if(i%4 == 1){
        x+= 0
        y+= wallLength
      }else if(i%4 == 2){
        x+= xDist 
        y+= yDist
      }else if(i%4 == 3){
        x+= 0
        y+= wallLength
      }
      ctx.lineTo(x,y)
      i++
    }
  }
  ctx.stroke()
}

//form submission button
document.forms[0]
onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  state.innerHTML = 'generating ...'
  requestAnimationFrame(()=>{
    try{
      setup(
        parseFloat(data.get('width').toString()),
        parseFloat(data.get('heigth').toString()),
        parseFloat(data.get('cellSize').toString()),
        parseFloat(data.get('shape').toString()),
      )
    }catch(err){
      if(err[0]) alert(err[1])
      console.log(err)
      return
    }
  })
}
//download button
(<HTMLButtonElement>document.querySelector('#d'))
.onclick = (e)=>{
  e.preventDefault()
  if(mazeExists){
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = c.toDataURL()
    a.download = 'maze.png'
    a.click()
  }else{
    alert('you need to generate your maze first bozo')
  }
}
//show solution button
(<HTMLInputElement>document.querySelector('#showSolution'))
.onclick = (e)=>{
  //data validation
  if(!mazeExists){
    e.preventDefault()
    alert('you need to generate your maze first bozo')
    return
  }
  //set line style based on 
  if((<HTMLInputElement>e.target).checked){
    ctx.strokeStyle = 'blue'
  }else{
    ctx.strokeStyle = 'white'
  }
  
  //trace the parent path
  let n = endingNode
  if(n.type==6){
    nodes.forEach(n=>n.y *= (Math.sqrt(3) / 2 ))
  }

  if((<HTMLInputElement>e.target).checked){
    ctx.lineWidth = 2
  }else{
    ctx.lineWidth = 3.5
  }
  
  ctx.beginPath()
  ctx.moveTo(n.x,n.y)
  while(n.parent != undefined){
    
    ctx.lineTo(n.parent.x,n.parent.y)
    ctx.lineTo(n.x,n.y)
    ctx.lineTo(n.parent.x,n.parent.y)
    n = n.parent
  }
  ctx.stroke()
  if(n.type==6){
    nodes.forEach(n=>n.y /= (Math.sqrt(3) / 2 ))
  }
  //re-draw start and end nodes
  startingNode.draw(ctx,blockSize)
  endingNode.draw(ctx,blockSize)
}
