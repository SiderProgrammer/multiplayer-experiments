let time = {
  seconds: 0,
  minutes: 0,
  tens_of_seconds: 0,
  tens_of_minutes: 0,
}

export default class TimeManager {
  static startMeasureTime(scene, _time, _clock) {
    time = _time

    const clock = _clock
    const endTime = scene.court_config.match_time

    // is whole scene as argument needed ?
    let { minutes, seconds, tens_of_seconds, tens_of_minutes } = time

    this.timeInterval = setInterval(() => {
      seconds++

      if (seconds === 10) {
        seconds = 0
        tens_of_seconds++
      }

      if (tens_of_seconds == 6) {
        tens_of_seconds = 0
        minutes++

        if (minutes === endTime) scene.timeOut()
      }

      if (minutes === 10) {
        minutes = 0
        tens_of_minutes++
      }
      clock.innerHTML = `${tens_of_minutes}${minutes}:${tens_of_seconds}${seconds}`
    }, 1000)

    this.saveTime = () => {
      time = {
        seconds,
        minutes,
        tens_of_seconds,
        tens_of_minutes,
      }
    }
  }

  static stopMeasureTime() {
    this.saveTime()
    clearInterval(this.timeInterval)
  }
}
