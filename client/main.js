import React from 'react'
import ReactDOM from 'react-dom'
import Calendar from './components/calendar'
import './main.css'

const Home = () => {
  const CALENDAR_ID = 'kcej035h7eidvmqc2cgcljchb0@group.calendar.google.com'
  const API_KEY = 'YOUR_API_KEY'
  return (
    <div>
      <Calendar calendarId={CALENDAR_ID} apiKey={API_KEY}/>
    </div>
  )
}

const target = document.getElementById('root')

ReactDOM.render(<Home />, target)
