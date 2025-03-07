import React, { useState, useEffect } from "react"
import "./style.css"

export const Webhook = ({ addNewNode, nodeToEdit, editNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")

  useEffect(() => {
    if (nodeToEdit) {
      setUrl(nodeToEdit.url)
      setMethod(nodeToEdit.method)
      setIsModalOpen(true)
    }
  }, [nodeToEdit])

  // Toggle Modal Function
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    if (!isModalOpen) {
      setUrl("")
      setMethod("GET")
    }
  }

  // Handle create button click
  const handleCreateClick = () => {
    if (nodeToEdit && nodeToEdit.id) {
      editNode(nodeToEdit.id, "Webhook", null, url, method)
    } else {
      addNewNode("Webhook", null, url, method)
    }
    toggleModal()
  }

  return (
    <div className='webhook'>
      <button onClick={toggleModal}>Integrate Webhook</button>
      {isModalOpen && (
        <div className='modal'>
          <div className='child'>
            <button onClick={toggleModal} className='close-btn'>
              X
            </button>
            <label>URL & Method</label>
            <div className='input-group'>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value='GET'>GET</option>
                <option value='POST'>POST</option>
              </select>
              <input
                type='text'
                value={url}
                placeholder='Enter URL'
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className='customize-header-group'>
              <label>Customize Headers</label>
              <div>
                <input type='text' placeholder='Content-Type' />
                <input type='text' placeholder='application/json' />
              </div>
            </div>
            <button onClick={handleCreateClick} className='send-btn'>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
