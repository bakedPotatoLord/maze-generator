import Node from './Node'

export default function BFS(start:Node,nodes:Node[],blockSize:number,traceRoutes?:boolean,ctx?:CanvasRenderingContext2D){
  nodes.forEach(el=>el.visited = false)
  let que: Node[] =[]
  start.visited = true
  start.generation = 0
  que.push(start)
  while(que.length >0){
    let v = que.shift()
    for(let child of v.getTouchingNodes(nodes,blockSize)){
      
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
      if(child.isEndingNode) return true
    }
  }
  return false
}