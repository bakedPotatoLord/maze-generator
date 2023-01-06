export const TAU = 2* Math.PI
import HexNode from "./HexNode"
import Node, { nodeHash } from "./Node"

export function makeSquareNodeMap(cw:number,ch:number,blockSize:number){
  return new Map(
    Array((cw/blockSize)*(ch/blockSize)).fill(0).map((_el,i)=>{
      return new Node(
        (i%(cw/blockSize)*(blockSize))+(blockSize/2),
        (Math.floor(i/(cw/blockSize))*(blockSize))+(blockSize/2)
      )
    })
    .map(el=>[el.toHash(),el])
  )
}

export function makeHexNodeMap(cw:number,ch:number,blockSize:number){
  const centers: HexNode[] = [];
  for (let y = blockSize; y < ch; y += blockSize) {
    // The x position of the first hexagon in each row is offset by half of the xDistance
    let x = (((y/blockSize) % 2 === 0) ? blockSize / 2 : 0 )+blockSize
    while (x < cw-(blockSize/2)) {
      centers.push(new HexNode(x,y));
      x += blockSize;
    }
  }

  return new Map(
    centers.map(el=>[el.toHash(),el])
  )
}

export const getStartingNode = (map:Map<string,Node>)=>
  (<[nodeHash,Node]>map.entries().next().value)[1]

export const getEndingNode = (map:Map<string,Node>) =>
  Array.from(map.entries())
  .pop()[1]
