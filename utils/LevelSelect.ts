import LevelButton from './LevelButton'

export default class LevelSelect {
  levels: LevelButton[]
  cw: number
  ch: number
  selected: LevelButton

  static readonly levels = Array(12)
    .fill(0)
    .map((_, i) => {
      return {
        w: 400 + (i * 100),
        h: Math.floor(400 + (i * 100) / 20) * 20,
      }
    })

  constructor(cw: number, ch: number) {
    this.cw = cw
    this.ch = ch
    this.levels = Array(12).fill(0).map((_, i) =>
      new LevelButton(
        (i * 140 + (40)) % 560,
        Math.floor(i / 4) * 80 + 140,
        100,
        50,
        i))
    this.selected = this.levels[0]
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = "46px Arial"
    ctx.fillStyle = "white"
    ctx.lineWidth = 3
    ctx.strokeStyle = "black"
    ctx.fillText("Level Select", this.cw / 2, this.ch / 5)
    this.levels.forEach(el => el.draw(ctx))
    this.selected.drawSelected(ctx)
  }

  moveLeft() {
    this.selected = this.levels[this.selected.level - 1] ?? this.selected
  }
  moveRight() {
    this.selected = this.levels[this.selected.level + 1] ?? this.selected
  }
  moveUp() {
    this.selected = this.levels[this.selected.level - 4] ?? this.selected
  }
  moveDown() {
    this.selected = this.levels[this.selected.level + 4] ?? this.selected
  }
}