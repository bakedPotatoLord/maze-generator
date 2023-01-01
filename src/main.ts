import Node from "./Node"
import BFS from "./bfs"
import rdfs from "./rdfs"
import { getEndingNode, getStartingNode, makeNodeMap} from "./helpers"

let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let form = document.forms[0]
let state = <HTMLParagraphElement>document.querySelector('#state')
ctx.fillStyle = "black"

// declare canvas vars
let cw:number
let ch:number 
let blockSize:number

// declare graph algorithm vars
let nodes:Map<string,Node>
let startingNode:Node
let endingNode:Node

//extra vars
let mazeExists = false

function setup(heigth:number,width:number,blockSizeP:number){
  //form validation
  if(!( width % blockSizeP == 0 || width % blockSizeP == 0))
    throw [true,new Error('Width and Heigth must be a multiple of blockSize')]
  //set up
  cw = c.width = heigth
  ch = c.height =width
  blockSize = blockSizeP
  nodes = makeNodeMap(cw,ch,blockSize) 
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
  BFS(startingNode,endingNode,nodes,blockSize,false) 

  mazeExists = true
  state.innerHTML = 'Generation Complete'
}

//form submission button
form.onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  state.innerHTML = 'generating ...'
  requestAnimationFrame(()=>{
    try{
      setup(
        parseFloat(data.get('width').toString()),
        parseFloat(data.get('heigth').toString()),
        parseFloat(data.get('blockSize').toString()),
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
(<HTMLButtonElement>document.querySelector('#showSolution'))
.onclick = (e)=>{
  e.preventDefault()
  if(mazeExists){
    let n = endingNode
    ctx.beginPath()
    ctx.moveTo(n.x,n.y)
    while(n.parent != undefined){
      ctx.lineWidth = 2
      ctx.strokeStyle = 'blue'
      ctx.lineTo(n.parent.x,n.parent.y)
      n = n.parent
    }
    ctx.stroke()
  }else{
    alert('you need to generate your maze first bozo')
  }
}
