
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
  constructor(x:number,y:number,parent?:Node){
    this.x =x
    this.y=y
    this.children = []
    this.parent = parent
    this.isEndingNode = false
    this.isStartingNode = false
  }

  draw=()=>{
    if(this.isStartingNode){
      ctx.fillStyle = "lightblue"
    }else if(this.isEndingNode){
      ctx.fillStyle = "red"
    }else{
      ctx.fillStyle ='black'
    }
    if(this.isEndingNode || this.isStartingNode){
      ctx.beginPath()
      ctx.arc(this.x,this.y,10,0,TAU)
      ctx.fill()
    }else{
      ctx.beginPath()
      ctx.arc(this.x,this.y,5,0,TAU)
      ctx.fill()
    }
  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(){
    return nodes.filter(n=>{
        return (this != n) && (Math.hypot(this.x-n.x,this.y-n.y) <= Math.sqrt(1600) )
    })
  }

  drawLineTo(node:Node){
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }
}
let nodes = Array(100).fill(0).map((el,i)=>
new Node((i%10*(cw/10))+(cw/20),(Math.floor(i/10)*(cw/10))+(cw/20)))
.filter(el=>Math.random() >= 0.5)

function start(){
  console.log("started")

  console.log(nodes)

  var startingNode = nodes[Math.floor(Math.random()*nodes.length)]
  //while(false) startingNode = nodes[Math.floor(Math.random()*100)]
  startingNode.isStartingNode = true
  var endingNode = nodes[Math.floor(Math.random()*nodes.length)]
  while(startingNode == endingNode ) endingNode = nodes[Math.floor(Math.random()*100)]
  endingNode.isEndingNode = true

  nodes.forEach(el=>el.draw())

  startingNode.getTouchingNodes().forEach(node=>{
    
  })


}



export{}
