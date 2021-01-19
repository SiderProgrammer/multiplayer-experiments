let time = {
  seconds: 0,
  minutes: 0,
  tens_of_seconds: 0,
  tens_of_minutes: 0,
}

module.exports = class TimeManager {
  static startMeasureTime(scene) {
    const endTime = scene.courtConfig.match_time

    // is whole scene as argument needed ?
    let minutes = time.minutes
    let seconds = time.seconds
    let tens_of_seconds = time.tens_of_seconds
    let tens_of_minutes = time.tens_of_minutes

    this.timeInterval = setInterval(() => {
      seconds++

      if (seconds === 10) {
        seconds = 0
        tens_of_seconds++
      }

      if (tens_of_seconds == 6) {
        tens_of_seconds = 0
        minutes++

        if (minutes === endTime) scene.timeOut() // TODO func
      }

      if (minutes === 10) {
        minutes = 0
        tens_of_minutes++
      }

      this.emitTime(scene)
    }, 1000)

    this.saveTime = () => {
      time = {
        seconds: seconds,
        minutes: minutes,
        tens_of_seconds: tens_of_seconds,
        tens_of_minutes: tens_of_minutes,
      }
    }
  }

  static stopMeasureTime() {
    if (typeof this.saveTime === "function") this.saveTime()
    clearInterval(this.timeInterval)
  }

  static getTime() {
    if (typeof this.saveTime === "function") this.saveTime()

    return time
  }
  static emitTime(scene) {
    scene.io.room(scene.room_name).emit("timeUpdate", this.getTime())
  }
}
