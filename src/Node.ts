
import { TAU } from "./main"

export default class Node{
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
  constructor(x:number,y:number,fill:number,parent?:Node){
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

  topLine(ctx:CanvasRenderingContext2D,blockSize:number){
    console.log('topline called')
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(-(blockSize/2),-(blockSize/2))
    ctx.lineTo(-(blockSize/2),(blockSize/2))
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-(blockSize/2),-(blockSize/2))
    ctx.lineTo(-(blockSize/2),(blockSize/2))
    ctx.stroke()


  }

  draw(ctx:CanvasRenderingContext2D,blockSize){
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
        this.topLine(ctx,blockSize)
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

  getTouchingNodes(nodes:Node[],blockSize:number){
    return nodes.filter(n=>
      (this != n) && 
      (Math.hypot(this.x-n.x,this.y-n.y) == blockSize ) &&
      !(n.y < this.y  && (this.lines[1] || n.lines[3])) &&
      !(n.y > this.y  && (this.lines[3] || n.lines[1])) &&
      !(n.x < this.x  && (this.lines[0] || n.lines[2])) &&
      !(n.x > this.x  && (this.lines[2] || n.lines[0])) 
    )
  }

  drawLineTo(node:Node,ctx:CanvasRenderingContext2D){
    ctx.moveTo(this.x,this.y)
    ctx.lineTo(node.x,node.y)
    ctx.stroke()
  }
}