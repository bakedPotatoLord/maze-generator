import Node from "./Node"
import BFS from "./bfs"
import rdfs from "./rdfs"
import { getEndingNode, getStartingNode, makeNodeMap} from "./helpers"

let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let form = document.forms[0]
ctx.fillStyle = "black"

// declare canvas vars
let cw:number
let ch:number 
let blockSize:number

// declare graph algorithm vars
let nodes:Map<string,Node>
let startingNode:Node;
let endingNode:Node;



let mazeExists = false

function setup(heigth:number,width:number,blockSizeP:number){
  //form validation
  if(heigth * width > 500_000){
    if(!confirm('Making large mazes like this can take A REALLY LONG TIME.\r\n\r\nDo you want to continue?')){
      throw [false]
    }else{
      alert('Suit yourself, but dont say I didnt warn you.\r\n\r\nIf your browser says that it is unresponsive, chose "wait", as the is just thinking really hard, and not broken')
    }
  }
  //more form validation
  if( width % blockSizeP == 0 && width % blockSizeP == 0){
    if(width >= blockSizeP && heigth >= blockSizeP){
      cw = c.width = heigth
      ch = c.height =width
      blockSize = blockSizeP
    }else{
      throw [true,new Error('Width and Heigth must be greater than blockSize')]
    }
  }else{
    throw [true,new Error('Width and Heigth must be a multiple of blockSize')]
  }

  nodes = makeNodeMap(cw,ch,blockSize) 

  startingNode = getStartingNode(nodes)
  startingNode.isStartingNode = true
  
  endingNode = getEndingNode(nodes)
  endingNode.isEndingNode = true
  rdfs(nodes,startingNode,blockSize)

  draw()
}

function draw(){
  console.log("started")

  ctx.fillStyle  = 'white'

  ctx.clearRect(0,0,cw,ch)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.fillRect(0,0,cw,ch)
  ctx.beginPath
  ctx.rect(1,1,cw-1,ch-1)
  ctx.stroke()
  
  nodes.forEach(el=>el.draw(ctx,blockSize))
  //use breadth-first search because depth first will find "a solutoion", but not "the" solutoin  
  BFS(startingNode,endingNode,nodes,blockSize,false) 
  mazeExists = true
}


form.onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  //@ts-ignore

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
}

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
