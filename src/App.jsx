import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")
const [amount, setAmount] = useState("")
  function handleAnalyse() {
    alert(
      "Message: " + message +
      "\nWebsite: " + website +
      "\nAmount: " + amount
    )
  }

  return (
    <div>
      <h1>Payment Risk Checker</h1>

      <p>Message</p>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Paste the suspicious message here"
      />

      <p>Website</p>

      <input
        type="text"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        placeholder="https://example.com"
      />

      <p>Amount</p>

      <input
        type="text"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="0.00"
      />

      <br />
      <br />

      <button onClick={handleAnalyse}>
        Analyse Payment
      </button>
    </div>
  )
}

export default App