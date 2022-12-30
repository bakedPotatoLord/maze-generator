
import Node from "./Node"
import BFS from "./bfs"
import rdfs from "./rdfs"

let c = document.querySelectorAll("canvas")[0]
let c2 = document.querySelectorAll("canvas")[1]
let ctx = c.getContext("2d")
let ctx2 = c2.getContext("2d")
let form = document.forms[0]
ctx.fillStyle = "black"

ctx.globalCompositeOperation = 'lighter'
ctx2.globalCompositeOperation = 'copy'

export let cw:number
export let ch:number 


export let fill:number
export let blockSize:number

let nodes:Node[] = []
let startingNode:Node;
let endingNode:Node;

let parsedData:[number,number,number,number]

function setup(heigth:number,width:number,blockSizeP:number,fillP:number){
  if(fillP < 0.7){
    if(!window.confirm('difficultties under 0.7 can take VERY LONG to render. are you sure that you want to continue')){
      throw [false]
    }
  } 
  if( width % blockSizeP == 0 && width % blockSizeP == 0){
    
    cw = c.width =c2.width= width
    ch = c.height= c2.height =heigth
  
    fill =parseFloat( fillP.toString())
    blockSize = blockSizeP
  }else{
    throw [true,new Error('Width and Heigth must be a multiple of blockSize')]
  }

  nodes = Array((cw/blockSize)*(ch/blockSize)).fill(0).map((_el,i)=>{
    return new Node(
      (i%(cw/blockSize)*(blockSize))+(blockSize/2),
      (Math.floor(i/(cw/blockSize))*(blockSize))+(blockSize/2))
  })   

  startingNode = nodes[0]
  startingNode.isStartingNode = true
  endingNode = nodes[nodes.length-1]
  endingNode.isEndingNode = true
  
  rdfs(nodes,startingNode,blockSize)

  draw()
}

export const TAU = 2*Math.PI


function draw(){
  console.log("started")

  ctx.fillStyle  = 'white'
  ctx2.fillStyle  = 'white'

  ctx.clearRect(0,0,cw,ch)
  ctx.strokeStyle = 'black'
  ctx.fillRect(0,0,cw,ch)
  ctx.strokeRect(0,0,cw,ch)

  ctx2.clearRect(0,0,cw,ch)
  ctx2.strokeStyle = 'black'
  ctx2.fillRect(0,0,cw,ch)
  ctx2.strokeRect(0,0,cw,ch)
  
  
  
  nodes.forEach(el=>el.draw(ctx,blockSize))
  
  let result = BFS(startingNode,endingNode,nodes,blockSize,false) 
  
  if(result ){
    let n = endingNode
    
    while(n.parent != undefined){
      ctx.lineWidth = 3
      ctx.strokeStyle = 'blue'
      ctx.beginPath()
      ctx.moveTo(n.x,n.y)
      ctx.lineTo(n.parent.x,n.parent.y)
      ctx.stroke()
      n = n.parent
    }

    nodes.forEach(el=>el.draw(ctx2,blockSize))
  }else{
    //console.log('retrying')
    requestAnimationFrame(()=>setup(...parsedData))
  }
}


form.onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  //@ts-ignore
  parsedData = Array.from(data.entries()).map(el=>el[1])
  try{

    setup(...parsedData)
  }catch(err){
    if(err[0]) alert(err[1])
    console.log(err)
    return
  }
}

(<HTMLButtonElement>document.querySelector('#d')).onclick = ()=> download(false);
(<HTMLButtonElement>document.querySelector('#ds')).onclick = ()=> download(true);

export function download(withSol:boolean){
  let a = document.createElement('a')
  document.body.appendChild(a)
  if(withSol){
    a.href = c.toDataURL()
    a.download = 'mazeSolution.png'
  }else{
    a.href = c2.toDataURL()
    a.download = 'maze.png'
  }
  a.click()
}

export{}
