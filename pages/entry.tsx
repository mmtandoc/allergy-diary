import React, { useState } from "react"
import Layout from "components/Layout"
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"
import AllergyRater from "components/AllergyRater"

const NewEntry = () => {
  const [startDate, setStartDate] = useState(new Date())
  const isPastDate = (date: Date) => date.getTime <= Date.now
  return (
    <Layout>
      <div className="page">
        <h1>New Journal Entry</h1>
        <form>
          <div className="form-input-group">
            <label>Date</label>
            <DatePicker
              name="date"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              filterDate={isPastDate}
            />
          </div>
          <div className="form-input-group">
            <label>Location</label>
            <input
              name="location"
              type="text"
              width="50"
              defaultValue="Milton, ON"
            />
          </div>
          <div className="form-input-group">
            <label>Allergy Severity</label>
            <AllergyRater value={2} />
          </div>
          <div className="form-input-group">
            <label>Notes</label>
            <textarea name="notes" placeholder="Add any notes here."></textarea>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <style jsx>{`
        form {
          width: 50%;
        }
        .form-input-group {
          display: flex;
          flex-direction: column;
          margin: 0 2.5rem 1.2rem 2rem;
        }
        input[type="text"],
        input[type="email"],
        input[type="url"],
        input[type="password"] {
          width: 50%;
        }
      `}</style>
    </Layout>
  )
}

export default NewEntry
