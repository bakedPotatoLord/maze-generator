import { startData, workerResponse } from "./workerGenerate"
import Worker from "./workerGenerate?worker" 

let c = document.querySelector("canvas")
let ctx = c.getContext("2d")
let state = <HTMLParagraphElement>document.querySelector('#state')
let mazeOptions = <HTMLDivElement>document.querySelector('.mazeOptions')

ctx.fillStyle = "black"


//extra vars
let mazeExists = false

async function doRealtimeGenerate(width: number, heigth: number, blockSize: number, shape: number){

  const work = new Worker();

  work.postMessage(<startData>{width, heigth, blockSize, shape})

  work.onmessage = (e) => {
    const {completion, state:workerState, done, imageData} = <workerResponse>e.data

    const formattedPercent = (completion*100).toFixed(2)+'%';
    state.innerHTML = (workerState==='RDFS')?('RDFSing: '+formattedPercent):('drawing: '+formattedPercent)
    if(done){
      console.log("done",e.data);
      work.terminate()
      mazeExists = true
      state.innerHTML = 'done'
      c.width = width*blockSize
      c.height = heigth*blockSize
      console.log(c,width,blockSize)
      ctx.putImageData(imageData, 0, 0)
    }

  }
  
}


//form submission button
document.forms[0]
onsubmit = (e) => {
  e.preventDefault()
  let data = (new FormData(<HTMLFormElement>e.target))
  state.innerHTML = 'generating ...'
  requestAnimationFrame(() => {
    try {
      doRealtimeGenerate(
        parseFloat(data.get('width').toString()),
        parseFloat(data.get('heigth').toString()),
        parseFloat(data.get('cellSize').toString()),
        parseFloat(data.get('shape').toString()),
      )
    } catch (err) {
      if (err[0]) alert(err[1])
      console.log(err)
      return
    }
  })
}
//download button
(<HTMLButtonElement>document.querySelector('#d'))
  .onclick = (e) => {
    e.preventDefault()
    if (mazeExists) {
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = c.toDataURL()
      a.download = 'maze.png'
      a.click()
    } else {
      alert('you need to generate your maze first bozo')
    }
  }
//show solution button
// let showSolution = (<HTMLInputElement>document.querySelector('#showSolution'))
// showSolution
//   .onclick = (e) => {
//     //data validation
//     if (!mazeExists) {
//       e.preventDefault()
//       alert('you need to generate your maze first bozo')
//       return
//     }
//     //set line style based on 
//     if ((<HTMLInputElement>e.target).checked) {
//       ctx.strokeStyle = 'blue'
//     } else {
//       ctx.strokeStyle = 'white'
//     }

//     //trace the parent path
//     let n = endingNode
//     if (n.type == 6 || n.type == 3) {
//       nodes.forEach(n => n.y *= (Math.sqrt(3) / 2))
//     }

//     if ((<HTMLInputElement>e.target).checked) {
//       ctx.lineWidth = 2
//     } else {
//       ctx.lineWidth = 3.5
//     }

//     ctx.beginPath()
//     ctx.moveTo(n.x, n.y)
//     while (n.parent != undefined) {

//       ctx.lineTo(n.parent.x, n.parent.y)
//       ctx.lineTo(n.x, n.y)
//       ctx.lineTo(n.parent.x, n.parent.y)
//       n = n.parent
//     }
//     ctx.stroke()
//     if (n.type == 6 || n.type == 3) {
//       nodes.forEach(n => n.y /= (Math.sqrt(3) / 2))
//     }
//     //re-draw start and end nodes
//     startingNode.draw(ctx, blockSize)
//     endingNode.draw(ctx, blockSize)
//   }
