export default class GoalElementsManager {
  constructor(scene) {
    this.game = scene

    this.graphics = this.game.add
      .graphics({
        lineStyle: {
          width: 5,
          color: 0x000000,
          alpha: 1,
        },
      })
      .setDepth(this.game.depths.goal_depth)

    this.goal_width = this.game.fieldConfig.goal_width
    this.goal_height = this.game.fieldConfig.goal_height

    this.nets = []
    this.posts = []
  }

  createLeftGoal(x, y) {
    this.strokeLeftBounds(x, y)
    this.createNet(x - this.goal_width / 2, y)
    this.createPost(x, y - this.goal_height * 0.5)
    this.createPost(x, y + this.goal_height * 0.5)
  }

  createRightGoal(x, y) {
    this.strokeRightBounds(x, y)
    this.createNet(x + this.goal_width / 2, y).setFlipX(true)
    this.createPost(x, y - this.goal_height * 0.5)
    this.createPost(x, y + this.goal_height * 0.5)
  }

  strokeLeftBounds(x, y) {
    const leftCornerDown = {
      x: x - this.goal_width,
      y: y + this.goal_height * 0.5,
    }

    const leftCornerUp = {
      x: x - this.goal_width,
      y: y - this.goal_height * 0.5,
    }

    this.graphics.strokePoints([
      {
        x,
        y: y + this.goal_height * 0.5,
      },
      {
        x: leftCornerDown.x,
        y: leftCornerDown.y,
      },
      {
        x: leftCornerUp.x,
        y: leftCornerUp.y,
      },
      {
        x,
        y: y - this.goal_height * 0.5,
      },
    ])
  }

  strokeRightBounds(x, y) {
    const rightCornerDown = {
      x: x + this.goal_width,
      y: y + this.goal_height * 0.5,
    }

    const rightCornerUp = {
      x: x + this.goal_width,
      y: y - this.goal_height * 0.5,
    }

    this.graphics.strokePoints([
      {
        x,
        y: y + this.goal_height * 0.5,
      },
      {
        x: rightCornerDown.x,
        y: rightCornerDown.y,
      },
      {
        x: rightCornerUp.x,
        y: rightCornerUp.y,
      },
      {
        x,
        y: y - this.goal_height * 0.5,
      },
    ])
  }

  createNet(x, y) {
    const net = this.game.add
      .tileSprite(x, y, this.goal_width, this.goal_height, "net")
      .setDepth(this.game.depths.net_depth)

    this.nets.push(net)
    return net
  }

  createPost(x, y) {
    const post = this.game.add
      .sprite(x, y, "post")
      .setDepth(this.game.depths.goalPost_depth)

    this.posts.push(post)
    return post
  }

  updateElementsPosition(difference, bounds) {
    this.graphics.clear()
    this.strokeLeftBounds(bounds.left.x, bounds.left.y)
    this.strokeRightBounds(bounds.right.x, bounds.right.y)
    this.posts.forEach((post) => (post.x += difference))
    this.nets.forEach((net) => (net.x += difference))
  }
}
