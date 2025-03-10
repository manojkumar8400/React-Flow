import React, { useState } from "react"
import "./style.css"
import { useEnrollmentContext } from "../../Context/UseEnrollmentTriggercontext"

export const EnrollmentTrigger = () => {
  const { isOpen, setIsOpen, setSelectedKeyword, selectedKeyword, keywordsList, setkeywordsList } =
    useEnrollmentContext();

  const [keywordValue, setKeywordValue] = useState('')

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const removeKeyword = (indexToRemove) => {
    setkeywordsList(keywordsList.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      <div>
        <h3>Enrollment Triggers</h3>
        <p>Filtering On</p>
        <select onChange={(e) => setSelectedKeyword(e.target.value)}>
          <option value='Incoming messages' key='1'>
            Incoming messages
          </option>
          <option value='Message contains Keywords' key='2'>
            Message contains Keywords
          </option>
        </select>
        {selectedKeyword === "Message contains Keywords" && (
          <div className="keyword-contains">
            <h3>Keywords</h3>
            <input type='text' onChange={(e) => setKeywordValue(e.target.value)} placeholder='Enter Keywords' />
            <button onClick={() =>{ setkeywordsList([...keywordsList, keywordValue]); setKeywordValue('')}}>Add</button>
            <ul>
              {keywordsList.map((keyword, index) => (
                <li key={index}>
                  {keyword}
                  <button onClick={() => removeKeyword(index)}>X</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className='btn-container'>
        <button onClick={toggleSidebar} className='close-btn'>
          Cancel
        </button>
        <button onClick={toggleSidebar} className='close-btn'>
          Save
        </button>
      </div>
    </div>
  )
}
