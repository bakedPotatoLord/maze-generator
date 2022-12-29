import type Node from './Node';

//randomized depth first search

// Josiah Hamm / bakedPotatoLord

export default function rdfs(nodes:Node[],startingNode:Node,blockSize:number){
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
    
    if(unvisited.length >0){
      que.push(current)
      let chosen = unvisited[Math.floor(Math.random()*unvisited.length)];
      current.wallsTo = current.wallsTo.filter((el)=>
        el != chosen
      )
      chosen.wallsTo = chosen.wallsTo.filter((el)=>
        el != current
      )
      chosen.visited = true
      que.push(chosen)
    } 

  }
  return nodes
}