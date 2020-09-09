const { ONE_DAY, ONE_WEEK } = require('./calendar-const')

function createWeek(dateMS) {
  const tmp = new Date(dateMS)
  const tmpDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate())
  return new Array(7).fill(0).map((day, i) => {
    return {
      date: new Date(+tmpDate + ONE_DAY * i)
    }
  })
}

function getStartDate(date) {
  const weekDayNumber = date.getDay() === 0 ? 6 : date.getDay() - 1
  const msToStartDay = ONE_DAY * (weekDayNumber + 7)
  return +date - msToStartDay
}

module.exports = {
  createMonthArray(currentDate) {
    const startDayMS = getStartDate(currentDate)
    return new Array(4).fill(0).map((week, i) => {
      return createWeek(startDayMS + ONE_WEEK * i)
    })
  }
}
