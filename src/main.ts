
let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let form = document.forms[0]
ctx.fillStyle = "black"

let cw 
let ch 


let fill 
let blockSize 

function setup(heigth:number,width:number,blockSizeP:number,fillP:number){

  cw = c.width = width
  ch = c.height =heigth

  fill = fillP
  blockSize = blockSizeP
  
}

setup(400,400,0.8,40)

export const TAU = 2*Math.PI
class Node{
  x: number
  y: number
  children:Node[]
  parent:Node
  isStartingNode:boolean
  isEndingNode:boolean
  isWall:boolean
  visited:boolean
  generation:number
  lines: boolean[]
  constructor(x:number,y:number,parent?:Node){
    this.x =x
    this.y=y
    this.children = []
    this.parent = parent
    this.isEndingNode = false
    this.isStartingNode = false
    this.visited = false
    this.generation = 0
    this.lines = Array(4).fill(false).map(()=>  Math.random() >= fill)
  }

  topLine(){
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(-(blockSize/2),-(blockSize/2))
    ctx.lineTo(-(blockSize/2),(blockSize/2))
    ctx.stroke()
  }

  draw(){
    if(this.isStartingNode){
      ctx.fillStyle = "green"
    }else if(this.isEndingNode){
      ctx.fillStyle = "red"
    }else{
      ctx.fillStyle ='black'
    }
    if(this.isEndingNode || this.isStartingNode){
      ctx.beginPath()
      ctx.arc(this.x,this.y,blockSize/3,0,TAU)
      ctx.fill()
    }
    ctx.save()
    ctx.translate(this.x,this.y)
    Array(4).fill(0).forEach((_el,i)=>{
      if(this.lines[i]){
        this.topLine()
      }
      ctx.rotate(Math.PI /2)
    })
    ctx.restore()
  
    //0 is left
    //1 is up
    //2 is right
    //3 is down
  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(){
    return nodes.filter(n=>{
        return (this != n) && 
        (Math.hypot(this.x-n.x,this.y-n.y) == blockSize ) &&
        !(n.y < this.y  && (this.lines[1] || n.lines[3])) &&
        !(n.y > this.y  && (this.lines[3] || n.lines[1])) &&
        !(n.x < this.x  && (this.lines[0] || n.lines[2])) &&
        !(n.x > this.x  && (this.lines[2] || n.lines[0])) 

    })
  }

  drawLineTo(node:Node){
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }
}
let nodes:Node[] = []

function draw(){
  console.log("started")

  ctx.clearRect(0,0,cw,ch)
  ctx.strokeStyle = 'black'
  ctx.strokeRect(0,0,cw,ch)
  ctx.strokeRect(0,0,cw,ch)
  
  nodes = Array((cw/blockSize)*(ch/blockSize)).fill(0).map((_el,i)=>{
    return new Node(
      (i%(cw/blockSize)*(blockSize))+(blockSize/2),
      (Math.floor(i/(cw/blockSize))*(blockSize))+(blockSize/2))
  })   
  var startingNode = nodes[0]
  startingNode.isStartingNode = true
  var endingNode = nodes[nodes.length-1]
  endingNode.isEndingNode = true

  nodes.forEach(el=>el.draw())

  console.log(BFS(startingNode,nodes) )

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

  console.log()
}

export function BFS(start:Node,nodes:Node[],traceRoutes?:boolean){
  nodes.forEach(el=>el.visited = false)
  let que: Node[] =[]
  start.visited = true
  start.generation = 0
  que.push(start)
  while(que.length >0){
    let v = que.shift()
    for(let child of v.getTouchingNodes()){
      
      if(!child.visited){
        child.generation = v.generation+1
        child.parent = v
        if(traceRoutes){
          ctx.strokeStyle = 'brown'
          ctx.beginPath()
          ctx.moveTo(child.x,child.y)
          ctx.lineTo(v.x,v.y)
          ctx.stroke()
        }
        child.visited = true
        que.push(child)
      }
      if(child.isEndingNode) return 'done'
    }
  }
  return 'unsolvable'
}

form.onsubmit= (e)=>{
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  //@ts-ignore
  let parsedData:[number,number,number,number] = Array.from(data.entries()).map(el=>el[1])
  setup(
    ...parsedData

  )
  draw()
}



export{}
