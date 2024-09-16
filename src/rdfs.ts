import type Node from './Node';
/**
 * @description randomized depth first search
 * @author Josiah Hamm / @bakedPotatoLord
 * @license MIT
 */
export default  function* rdfs(nodes:Map<string,Node>,startingNode:Node,blockSize:number){
  const allNodes = nodes.size*2
  let i = 0
  // reset all nodes to default state
  nodes.forEach(n=>{
    n.visited = false
    n.wallsTo = n.getTouchingNodes(nodes,blockSize)
  })
  //initialize algorithm
  startingNode.visited = true
  let que = [startingNode]
  while(que.length > 0){
    i++
    yield (i/allNodes)
    //pick from bottom of stack
    let current = que.shift()
    // 
    let unvisited = current
      .getTouchingNodes(nodes,blockSize)
      .filter((el)=>!el.visited)
    // only add nodes to stack if they can grow
    if(unvisited.length){ //type coersion go brrr
      // add current to top of stack
      que.push(current)
      // chose random Node from unvisited
      let chosen = unvisited[Math.floor(Math.random()*unvisited.length)];
      // remove walls
      current.wallsTo = current.wallsTo.filter(el=>el != chosen)
      chosen.wallsTo = chosen.wallsTo.filter(el=>el!=current)
      // im not explaining this line
      chosen.visited = true
      // add chosen to the bottom of stack (This is the DEPTH FIRST part)
      que.unshift(chosen)
    } 
  }
  return nodes
}