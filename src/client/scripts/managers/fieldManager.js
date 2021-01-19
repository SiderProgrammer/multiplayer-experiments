export default class FieldManager {
  constructor(scene) {
    this.game = scene

    this.field = this.game.add.tileSprite(
      this.game.GW / 2,
      this.game.GH / 2,
      this.game.fieldConfig.width,
      this.game.fieldConfig.height,
      "field"
    )
    this.field.halfWidth = this.field.displayWidth / 2
    this.field.halfHeight = this.field.displayHeight / 2

    this.graphics = this.game.add.graphics()
  }

  createCourtLines() {
    this.graphics
      .lineStyle(5, 0xffffff, 1)
      .fillStyle(0xffffff, 0.5)

      // middle line
      .strokeLineShape({
        x1: this.field.x,
        y1: this.field.y + this.field.displayHeight / 2,
        x2: this.field.x,
        y2: this.field.y - this.field.displayHeight / 2,
      })
      // middle big circle

      .strokeCircle(
        this.game.GW / 2,
        this.game.GH / 2,
        this.game.court_config.middle_circle_radius
      )

      // middle small circle
      .fillCircle(
        this.game.GW / 2,
        this.game.GH / 2,
        this.game.court_config.middle_small_circle_radius
      )
      // field border
      .strokeRect(
        this.field.x - this.field.displayWidth / 2,
        this.field.y - this.field.displayHeight / 2,
        this.field.displayWidth,
        this.field.displayHeight
      )
  }

  getField() {
    return this.field
  }

  centerElements() {
    this.field.x = this.game.GW / 2
    this.graphics.clear()
    this.createCourtLines()
  }
}
