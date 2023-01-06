import Node from "./Node"

export type nodeHash = string


export default class HexNode extends Node{
  type=6
  constructor(x:number,y:number,parent?:Node){
    super(x,y,parent)
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

  draw(ctx:CanvasRenderingContext2D,blockSize:number){

    //this.y is a lie

    // multiply it by (Math.sqrt(3) / 2 )

    let ySave = this.y
    this.y =Math.sqrt(3) / 2 *this.y

    if(this.isStartingNode){
      ctx.fillStyle = "green"
    }else if(this.isEndingNode){
      ctx.fillStyle = "red"
    }
    if(this.isEndingNode || this.isStartingNode){
      ctx.beginPath()
      ctx.arc(this.x,this.y,blockSize/3,0,Node.TAU)
      ctx.fill()
    }
    ctx.strokeStyle ='rgb(0,0,0)'
    // ctx.beginPath()
    // ctx.arc(this.x,this.y,blockSize/5,0,Node.TAU)
    // ctx.fill()
    let wallLength = (blockSize/2)* (1 / Math.cos(Math.PI/6))
    
    this.wallsTo.forEach((el)=>{
      ctx.save()
      ctx.translate(this.x,this.y)
      ctx.rotate(Math.atan2(this.y-el.y*(Math.sqrt(3) / 2 ),this.x-el.x)+ Math.PI)

      ctx.beginPath()
      ctx.moveTo(blockSize/2,wallLength/2)
      ctx.lineTo(blockSize/2,-wallLength/2)

      ctx.stroke()
      ctx.restore()
    })

    this.y = ySave
    
  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(nodes:Map<nodeHash,Node>,blockSize:number){
    blockSize
    return [
      nodes.get(this.hashFrom(this.x+blockSize,this.y)),
      nodes.get(this.hashFrom(this.x-blockSize,this.y)),
      nodes.get(this.hashFrom(this.x+(blockSize/2),this.y+blockSize)),
      nodes.get(this.hashFrom(this.x-(blockSize/2),this.y+blockSize)),
      nodes.get(this.hashFrom(this.x+(blockSize/2),this.y-blockSize)),
      nodes.get(this.hashFrom(this.x-(blockSize/2),this.y-blockSize)),
    ].filter(el=> el ?? false)
  }

  getViableNodes(nodes:Map<nodeHash,Node>,blockSize:number){
    let tNodes = this.getTouchingNodes(nodes,blockSize)
    return tNodes
    .filter(
      el=>!this.wallsTo.includes(el) && 
      !el.wallsTo.includes(this)
    )
  }

  drawLineTo(node:Node,ctx:CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.moveTo(this.x,this.y*(Math.sqrt(3) / 2 ))
    ctx.lineTo(node.x,node.y*(Math.sqrt(3) / 2 ))
    ctx.stroke()
  }

}