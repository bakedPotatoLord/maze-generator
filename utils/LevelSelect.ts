import LevelButton from './LevelButton'

export default class LevelSelect{
  levels: LevelButton[]

  constructor(){
    this.levels = Array(10).fill(0).map((el,i)=>
    new LevelButton(i*100,0,100,100,i))
  }
}