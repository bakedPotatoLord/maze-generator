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
  cw/=blockSize
  ch/=blockSize
  return new Map(
    Array((cw)*(ch)).fill(0).map((_el,i)=>{
      let x = i%(cw)
      let y = Math.floor(i/(cw))
      return new HexNode(
        (i%(cw)*(blockSize))+(blockSize/2),
        (Math.floor(i/(cw))*(blockSize))+(blockSize/2)
      )
    })
    .map(el=>[el.toHash(),el])
  )
}

export const getStartingNode = (map:Map<string,Node>)=>
  (<[nodeHash,Node]>map.entries().next().value)[1]

export const getEndingNode = (map:Map<string,Node>) =>
  Array.from(map.entries())
  .pop()[1]
