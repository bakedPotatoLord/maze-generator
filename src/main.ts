
let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
ctx.fillStyle = "black"

const cw = c.width = 400
const ch = c.height =400
window.onload = ()=>{ start() }

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
    this.lines = Array(4).fill(false).map((el,i)=>  Math.random() >= 0.80)
  }

  topLine(){
    ctx.beginPath()
    ctx.moveTo(-cw/20,-ch/20)
    ctx.lineTo(-cw/20,ch/20)
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
      ctx.arc(this.x,this.y,ch/40,0,TAU)
      ctx.fill()
    }
    ctx.save()
    ctx.translate(this.x,this.y)
    if(this.lines[0]){
      this.topLine()
    }
    ctx.rotate(Math.PI /2)
    if(this.lines[1]){
      this.topLine()
    }
    ctx.rotate(Math.PI /2)
    if(this.lines[2]){
      this.topLine()
    }
    ctx.rotate(Math.PI /2)
    if(this.lines[3]){
      this.topLine()
    }
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
        (Math.hypot(this.x-n.x,this.y-n.y) == 40 ) &&
        (!(n.y < this.y  && (this.lines[1] || n.lines[3]))) &&
        (!(n.y > this.y  && (this.lines[3] || n.lines[1]))) &&
        (!(n.x < this.x  && (this.lines[0] || n.lines[2]))) &&
        (!(n.x > this.x  && (this.lines[2] || n.lines[0]))) 

    })
  }

  drawLineTo(node:Node){
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }
}
let nodes = Array((cw/40)*(ch/40)).fill(0).map((el,i)=>
new Node((i%10*(cw/10))+(cw/20),(Math.floor(i/10)*(cw/10))+(cw/20)))


function start(){
  console.log("started")
  ctx.rect(0,0,cw,ch)

  var startingNode = nodes[0]
  startingNode.isStartingNode = true
  var endingNode = nodes[nodes.length-1]
  while(startingNode == endingNode ) endingNode = nodes[Math.floor(Math.random()*nodes.length)]
  endingNode.isEndingNode = true

  nodes.forEach(el=>el.draw())


  BFS(startingNode,nodes)

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



export{}
