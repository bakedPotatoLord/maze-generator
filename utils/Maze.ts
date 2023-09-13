import { makeSquareNodeMap} from './helpers'
import Node from './Node'
import rdfs from './rdfs'

export default class Maze{
    // declare canvas vars
    cw:number
    ch:number
    blocksize:number
    numW: number
    numH: number

    // declare graph algorithm vars
	readonly nodes:Map<string,Node>
	startingNode:Node
	endingNode?:Node

    constructor(numW=20,numH=20,blocksize=20){
        this.cw = numW * blocksize
        this.ch = numH * blocksize
        this.blocksize = blocksize

        this.numW = numW
        this.numH = numH

	    this.nodes = makeSquareNodeMap(this.cw,this.ch,this.blocksize) 

        //create start and end nodes
        this.startingNode = this.nodes.entries().next().value[1]
        if(this.startingNode) this.startingNode.isStartingNode = true
        this.endingNode = Array.from(this.nodes.entries())
        .pop()?.[1]
        if(this.endingNode) this.endingNode.isEndingNode = true

        //do the grunt work
	    rdfs(this.nodes,this.startingNode,this.blocksize)    

        this.nodes.forEach(n=>{
            n.walls ={
                left: n.wallsTo.filter(no=>no.x == n.x-20 && no.y ==n.y).length > 0 || n.x == blocksize/2,
                right: n.wallsTo.filter(no=>no.x == n.x+20 && no.y ==n.y).length>0 || n.x == this.cw - blocksize/2,
                top: n.wallsTo.filter(no=>no.x == n.x && no.y ==n.y-20).length>0 || n.y == blocksize/2,
                bottom: n.wallsTo.filter(no=>no.x == n.x && no.y ==n.y+20).length>0|| n.y == this.ch - blocksize/2,
            }
        })
        console.log("make constructed successfully")
    }

    draw(ctx:CanvasRenderingContext2D){
		ctx.fillStyle  = 'white'
        ctx.clearRect(0,0,this.cw,this.ch)
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.fillRect(0,0,this.cw,this.ch)
        ctx.beginPath
        ctx.rect(1,1,this.cw-1,this.ch-1)
        ctx.stroke()
        //draw all nodes
        this.nodes.forEach(el=>el.draw(ctx,this.blocksize))
        //use breadth-first search because depth first will find "a" solutoion, but not "the" solutoin  
        //bfs(startingNode,endingNode,nodes,blockSize,false) 
    }
  
  
}