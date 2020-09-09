import React, { useState, useEffect } from 'react'
import axios from 'axios'

const { WEEK_DAYS, MONTHS, ONE_WEEK } = require('./calendar-const')

const { createMonthArray } = require('./calendar-func.js')

const Calendar = (props) => {
  const [events, setEvents] = useState({})

  useEffect(() => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${props.calendarId}/events?key=${props.apiKey}`

    axios(url).then(({ data }) => {
      const eList = data.items.reduce((acc, event) => {
        const eventFullDate = new Date(Date.parse(event.start.date || event.start.dateTime))
        const eventDate = +new Date(
          eventFullDate.getFullYear(),
          eventFullDate.getMonth(),
          eventFullDate.getDate()
        )
        const timeToString = (n) => {
          return `${n}`.length === 1 ? `0${n}` : `${n}`
        }
        const eventHours = timeToString(eventFullDate.getHours())
        const eventMinutes = timeToString(eventFullDate.getMinutes())
        const eventTimeStr = `${eventHours}:${eventMinutes}`
        const eventTitle = event.summary

        const eventObj = {
          time: eventTimeStr,
          title: eventTitle
        }
        if (typeof acc[eventDate] === 'undefined') {
          return { ...acc, [eventDate]: [eventObj] }
        }
        return { ...acc, [eventDate]: [...acc[eventDate], eventObj] }
      }, {})

      setEvents(eList)
    })
  }, [props.apiKey, props.calendarId])

  const dateTmp = new Date()
  const currentDate = new Date(dateTmp.getFullYear(), dateTmp.getMonth(), dateTmp.getDate())

  const [focusDate, setFocusDate] = useState(currentDate)

  const monthArray = createMonthArray(focusDate)
  const weekDays = new Array(7).fill(0).map((it, i) => WEEK_DAYS[i])

  return (
    <div>
      <div className="bg-gray-800 h-16 flex flex-wrap justify-center items-center text-gray-600">
        <div className=" w-full flex  justify-center items-center">
          <div className="w-32 mr-2 ml-2 text-teal-300 font-light">
            {MONTHS[focusDate.getMonth()]} {focusDate.getFullYear()}
          </div>

          <button
            type="button"
            className="text-gray-600 hover:text-teal-500"
            onClick={() => {
              setFocusDate(new Date(+focusDate - ONE_WEEK))
            }}
          >
            &#8593;
          </button>
          <button
            type="button"
            className="mx-2 px-2 text-gray-200 bg-teal-500 hover:bg-teal-600 rounded"
            onClick={() => {
              setFocusDate(currentDate)
            }}
          >
            Today
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-teal-500"
            onClick={() => {
              setFocusDate(new Date(+focusDate + ONE_WEEK))
            }}
          >
            {' '}
            &#8595;{' '}
          </button>
        </div>
        <div className="w-full flex  justify-around px-2 ">
          {weekDays.map((day) => {
            return (
              <div key={day} className="text-xs text-teal-400 font-light">
                {day}
              </div>
            )
          })}
        </div>
      </div>
      <div>
        {monthArray.map((week, i) => {
          return (
            <div className="flex h-20" key={i}>
              {week.map((day) => {
                let dateCss = 'px-1 text-teal-800'
                let bgCss = 'bg-teal-100'
                let hoverCss = 'bg-teal-100'
                let textCss = 'text-gray-800'
                if (+day.date === +currentDate) {
                  dateCss = 'px-1 text-white'
                  bgCss = 'bg-teal-500'
                } else if (+day.date < +currentDate) {
                  dateCss = 'px-1 text-gray-500'
                  bgCss = 'bg-gray-100'
                  hoverCss = 'bg-gray-100'
                  textCss = 'text-gray-500'
                } else if (
                  day.date.getMonth() === focusDate.getMonth() &&
                  day.date.getFullYear() === focusDate.getFullYear()
                ) {
                  bgCss = 'bg-teal-200'
                }

                return (
                  <div
                    key={day.date.getDate()}
                    className={`flex-1 hover:${hoverCss} border border-gray-200 ${textCss} text-left font-normal text-lg lg:text-sm`}
                  >
                    <div className={`${dateCss} ${bgCss}`}>{day.date.getDate()}</div>
                    <div className="px-1 h-full text-xs pt-2">
                      {events[+day.date] &&
                        events[+day.date].map((e) => {
                          return (
                            <div key={e.title}>
                              {e.time} {e.title}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar