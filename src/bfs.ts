import Node from './Node'

export default function BFS(start:Node,end:Node,nodes:Map<string,Node>,blockSize:number,traceRoutes?:boolean,ctx?:CanvasRenderingContext2D){
  nodes.forEach(el=>el.visited = false)
  let que: Node[] =[]
  start.visited = true
  start.generation = 0
  que.push(start)
  while(que.length >0){
    let v = que.shift()
    for(let child of v.getViableNodes(nodes,blockSize)){
      
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
      if(child == end) return true
    }
  }
  return false
}