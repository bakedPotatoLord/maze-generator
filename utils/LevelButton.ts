
export default class LevelButton{
  readonly x:number
  readonly y:number
  readonly w:number
  readonly h:number
  readonly level:number
  isSelected=false

  constructor(x:number,y:number,w:number,h:number,level:number){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.level = level
  }

  draw(ctx:CanvasRenderingContext2D){
    ctx.fillStyle = "white"
    ctx.strokeStyle = "black"
    ctx.fillRect(this.x,this.y,this.w,this.h)
    ctx.strokeRect(this.x,this.y,this.w,this.h)
    ctx.fillText(this.level.toString(),this.x+this.w/2,this.y+this.h/2)
  }

}