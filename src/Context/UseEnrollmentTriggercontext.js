import axios from "axios"
import { createContext, useContext, useState, useEffect } from "react"

const enrollmentTriggerContext = createContext()

const EnrollmentTriggerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState('Incoming messages')
  const [keywordsList, setkeywordsList] = useState([])

  return (
    <enrollmentTriggerContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedKeyword,
        setSelectedKeyword,
        keywordsList,
        setkeywordsList,
      }}
    >
      {children}
    </enrollmentTriggerContext.Provider>
  )
}

const useEnrollmentContext = () => useContext(enrollmentTriggerContext)

export { useEnrollmentContext, EnrollmentTriggerProvider }
