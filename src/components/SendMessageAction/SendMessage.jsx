import React, { useState, useEffect } from "react"
import "./style.css"

export const SendMessage = ({ addNewNode, editNode, nodeToEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (nodeToEdit) {
      setMessage(nodeToEdit.label)
      setImage(nodeToEdit.image)
      setIsModalOpen(true)
    }
  }, [nodeToEdit])

  // Toggle Modal Function
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    if (!isModalOpen) {
      setMessage("")
      setImage(null)
    }
  }

  // Handle message change
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  // Handle create button click
  const handleCreateClick = () => {
    console.log({nodeToEdit}, '++++++++');
    
    if (nodeToEdit && nodeToEdit.id) {
      editNode(nodeToEdit.id, message, image)
    } else {
      addNewNode(message, image)
    }
    toggleModal()
  }

  return (
    <div className='send-msg'>
      <button onClick={toggleModal} className='send-btn'>
        Send Message
      </button>
      {/* Modal (Conditional Rendering) */}
      {isModalOpen && (
        <div className='modal'>
          <div className='child'>
            <button onClick={toggleModal} className="close-btn">X</button>
            <textarea
              cols='30'
              rows='5'
              placeholder='Type your message...'
              value={message}
              onChange={handleMessageChange}
            ></textarea>
            <input type='file' onChange={handleImageChange} />
            <button onClick={handleCreateClick} className='send-btn'>
              {nodeToEdit ? "Save" : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
