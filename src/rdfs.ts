import type Node from './Node';

//randomized depth first search

// Josiah Hamm / bakedPotatoLord
/*
let c = document.querySelectorAll('canvas')[2]
let ctx = c.getContext('2d')

c.width = 400
c.height = 400
*/
export default function rdfs(nodes:Map<string,Node>,startingNode:Node,blockSize:number){
  nodes.forEach(n=>{
    n.visited = false
    n.wallsTo = n.getTouchingNodes(nodes,blockSize)
  })


  startingNode.isStartingNode = true
  startingNode.visited = true
  let que = [startingNode]

  while(que.length > 0){
    let current = que.shift()
    let unvisited = current
    .getTouchingNodes(nodes,blockSize)
    .filter((el)=>!el.visited)
    let chosen:Node
    
    if(unvisited.length >0){
      que.push(current)
      chosen = unvisited[Math.floor(Math.random()*unvisited.length)];
      current.wallsTo = current.wallsTo.filter((el)=>
        el != chosen
      )
      chosen.wallsTo = chosen.wallsTo.filter((el)=>
        el != current
      )
      chosen.visited = true
      que.unshift(chosen)

      // ctx.clearRect(0,0,400,400)
      // nodes.forEach(n=>n.draw(ctx,40))
      // chosen.isEndingNode = true
      // chosen.draw(ctx,40)
      // chosen.isEndingNode = false
    } 
    
  }
  return nodes
}