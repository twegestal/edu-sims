import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  const handleFetchMessageFromBackend = () => {
    fetch('api/hello')
    .then(response => response.json())
    .then(data => {
        setMessage(data);
      })
  }
  

  return (
    <>
      <h1>{message}</h1>
      <button onClick={handleFetchMessageFromBackend}>Klicka här</button>
    </>
  )
}

export default App
