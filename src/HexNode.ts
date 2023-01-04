import Node from "./Node"

export type nodeHash = string


export default class HexNode extends Node{
  t:number
  bl:number
  br:number

  constructor(t:number,bl:number,br:number,parent?:Node){
    super(null,null,parent)
    this.t = t
    this.bl = bl
    this.br= br

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
    ctx.strokeStyle ='black'

    this.wallsTo.forEach((el)=>{
      ctx.save()
      ctx.translate(this.x,this.y)
      ctx.rotate(Math.atan2(this.y-el.y,this.x-el.x)+ Math.PI)

      ctx.beginPath()
      ctx.moveTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.lineTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.lineTo(blockSize/2,blockSize/2)
      ctx.lineTo(blockSize/2,-blockSize/2)
      ctx.stroke()
      ctx.restore()
    })
  }

  addChildren=(...node:Node[])=>this.children.push(...node)

  getTouchingNodes(nodes:Map<nodeHash,Node>,blockSize:number){
    return [
      nodes.get(this.hashFrom(this.t+blockSize,this.bl,this.br)),
      nodes.get(this.hashFrom(this.t,this.bl+blockSize,this.br)),
      nodes.get(this.hashFrom(this.t,this.bl,this.br+blockSize)),
      nodes.get(this.hashFrom(this.t+blockSize,this.bl+blockSize,this.br)),
      nodes.get(this.hashFrom(this.t,this.bl+blockSize,this.br+blockSize)),
      nodes.get(this.hashFrom(this.t+blockSize,this.bl,this.br+blockSize)),
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

  toHash = ():nodeHash=> this.t+','+this.bl+','+this.br

}