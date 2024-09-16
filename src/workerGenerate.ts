import bfs from "./bfs"
import { getEndingNode, getStartingNode, makeHexNodeMap, makeSquareNodeMap, makeTriNodeMap } from "./helpers"
import Node from './Node'
import rdfs from "./rdfs"

export type startData = {
  width: number
  heigth: number
  blockSize: number
  shape: number
}

export type workerResponse = {
  completion: number
  state: "RDFS" | "draw"
  done: boolean
  imageData?: ImageData
}


onmessage = (e: MessageEvent<startData>) => {
  const { width, heigth, blockSize, shape } = e.data

  realtimeGenerate(width, heigth, blockSize, shape)
}

async function realtimeGenerate(width: number, heigth: number, blockSizeP: number, shape: number) {

  // declare graph algorithm vars
  let nodes: Map<string, Node>
  let startingNode: Node
  let endingNode: Node

  let imageData: ImageData
  const c = new OffscreenCanvas(0, 0)
  const ctx = c.getContext('2d')

  //set up
  const numH = heigth
  const numW = width
  const blockSize = blockSizeP
  let ch = c.height = heigth * blockSize
  let cw = c.width = width * blockSize




  if (shape == 4) {
    nodes = makeSquareNodeMap(cw, ch, blockSize)
  } else if (shape == 6) {
    nodes = makeHexNodeMap(cw, ch, blockSize)
    ch = c.height = (heigth) * blockSize * (Math.sqrt(3) / 2)
  } else if (shape == 3) {
    nodes = makeTriNodeMap(cw, blockSize)
    ch = c.height = (heigth) * blockSize * (Math.sqrt(3) / 2)
  }
  //create start and end nodes
  startingNode = getStartingNode(nodes)
  startingNode.isStartingNode = true
  endingNode = getEndingNode(nodes)
  endingNode.isEndingNode = true
  //do the grunt work





  for (const completion of rdfs(nodes, startingNode, blockSize)) {

    postMessage(<workerResponse>{
      completion,
      state: 'RDFS',
      done: false
    })
  }

  
    //draw rect border
    ctx.fillStyle = 'white'
    ctx.clearRect(0, 0, cw, ch)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.fillRect(0, 0, cw, ch)
    ctx.beginPath
    ctx.rect(1, 1, cw - 1, ch - 1)
    ctx.stroke()
    //draw all node
    let i = 0
    const count = nodes.size
    for (const node of nodes.values()) {
      node.draw(ctx, blockSize)
      i++;
      
      postMessage(<workerResponse>{
        completion: i / count,
        state: 'draw',
        done: false
      })
    }
    //use breadth-first search because depth first will find "a" solutoion, but not "the" solutoin  
    bfs(startingNode, endingNode, nodes, blockSize, false)


    if (startingNode.type == 6) {
      ctx.save()
      drawHexBorder('x')
      if (numH % 2 == 0) {
        ctx.translate(0, (ch) - blockSize - 1)
      } else {
        ctx.translate(-blockSize / 2, (ch) - blockSize - 1)
      }
      drawHexBorder('x', true)
      ctx.restore()

      ctx.save()
      drawHexBorder('y')
      ctx.translate(cw - blockSize, 0)
      drawHexBorder('y', true)
      ctx.restore()
    }

  postMessage(<workerResponse>{
    completion: 1,
    state: 'draw',
    done: true,
    imageData: ctx.getImageData(0, 0, cw, ch)
  })
  return;
  

  function drawHexBorder(axis: 'x' | 'y', flip?: boolean) {

    let wallLength = (blockSize / 2) * (1 / Math.cos(Math.PI / 6))
    let xDist = blockSize / 2
    let yDist = blockSize / (2 * Math.sqrt(3))

    let x = blockSize / 2
    let y = blockSize / 4
    ctx.beginPath()
    ctx.moveTo(x, y)
    if (axis == 'x') {
      x = 0
      y = blockSize / 2
      ctx.moveTo(x, y)
      let i = flip ? 1 : 0
      while (x < cw + blockSize) {
        ctx.lineTo(x, y)
        x += xDist
        y += (i % 2 == 0) ? -yDist : yDist
        i++
      }
    } else {
      let i = flip ? 2 : 0
      while (y < ch - yDist * 4) {
        if (i % 4 == 0) {
          x += -xDist
          y += yDist
        } else if (i % 4 == 1) {
          x += 0
          y += wallLength
        } else if (i % 4 == 2) {
          x += xDist
          y += yDist
        } else if (i % 4 == 3) {
          x += 0
          y += wallLength
        }
        ctx.lineTo(x, y)
        i++
      }
    }
    ctx.stroke()
  }
}

