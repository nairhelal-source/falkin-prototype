import { useState } from "react"

function App() {
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")
  const [amount, setAmount] = useState("")
  const [newRecipient, setNewRecipient] = useState(false)
  const [channel, setChannel] = useState("WhatsApp")

  const [riskScore, setRiskScore] = useState(null)
  const [reasons, setReasons] = useState([])
  const [riskLevel, setRiskLevel] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [intervention, setIntervention] = useState("")

  async function handleAnalyse() {
    const paymentRequest = { message, website, amount, newRecipient, channel }

    try {
      const response = await fetch("http://localhost:3001/api/analyse", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentRequest)
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()


      setRiskScore(result.score)
      setReasons(result.riskReasons)
      setRiskLevel(result.level)
      setRecommendation(result.advice)
      setIntervention(result.intervention)

    } catch (error) {
      alert("Error during analysis: " + error.message)
    }
  }

  return (
    <div>
      <h1>Payment Risk Checker</h1>

      <p>Check a payment request before sending money.</p>

      <div>
        <p>Message</p>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Paste the suspicious message here"
        />
      </div>

      <div>
        <p>Website</p>

        <input
          type="text"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <p>Payment Amount</p>

        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="2000"
        />
      </div>

      <div>
        <p>Is this a new recipient?</p>

        <label>
          <input
            type="checkbox"
            checked={newRecipient}
            onChange={(event) => setNewRecipient(event.target.checked)}
          />

          New recipient
        </label>
      </div>

      <div>
        <p>How did you receive the request?</p>

        <select
          value={channel}
          onChange={(event) => setChannel(event.target.value)}
        >
          <option value="WhatsApp">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Telegram">Telegram</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <br />

      <button onClick={handleAnalyse}>
        Analyse Payment
      </button>

      {riskScore !== null && (
        <div>
          <h2>Analysis Result</h2>

          <h3>Risk Score</h3>
          <p>{riskScore} / 100</p>

          <h3>Risk Level</h3>
          <p>{riskLevel}</p>

          <h3>Detected Risks</h3>

          {reasons.length > 0 ? (
            <ul>
              {reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p>No specific warning signals detected.</p>
          )}

          <h3>Recommended Action</h3>
          <p>{recommendation}</p>

          <h3>Intervention</h3>
          <p>{intervention || "No intervention needed"}</p>
        </div>
      )}
    </div>
  )
}

export default App