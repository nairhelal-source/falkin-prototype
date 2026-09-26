import { useState } from "react"
import "./App.css"

function App() {
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")
  const [amount, setAmount] = useState("")
  const [newRecipient, setNewRecipient] = useState(false)
  const [channel, setChannel] = useState("WhatsApp")

  const [analysisId, setAnalysisId] = useState(null)
  const [riskScore, setRiskScore] = useState(null)
  const [reasons, setReasons] = useState([])
  const [riskLevel, setRiskLevel] = useState("")
  const [recommendation, setRecommendation] = useState("")
  const [intervention, setIntervention] = useState("")
  const [userDecision, setUserDecision] = useState("")
  const [decisionSubmitted, setDecisionSubmitted] = useState(false)
  const [riskConfirmed, setRiskConfirmed] = useState(false)
  const [evaluation, setEvaluation] = useState(null)

  async function handleAnalyse() {
    setRiskConfirmed(false)
    setDecisionSubmitted(false)

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

      setAnalysisId(result.analysisId)
      setRiskScore(result.score)
      setReasons(result.riskReasons)
      setRiskLevel(result.level)
      setRecommendation(result.advice)
      setIntervention(result.intervention)
    } catch (error) {
      alert("Error during analysis: " + error.message)
    }
  }

  function getInterventionClass() {
    if (intervention === "No intervention") {
      return "intervention-low"
    }

    if (intervention === "Safety nudge") {
      return "intervention-nudge"
    }

    if (intervention === "Warning") {
      return "intervention-warning"
    }

    if (intervention === "Confirmation required") {
      return "intervention-confirmation"
    }

    if (intervention === "Strong intervention") {
      return "intervention-strong"
    }

    return ""
  }

  async function handleVerify() {
    const response = await fetch("http://localhost:3001/api/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId,
        decision: "verified"
      })
    })

    if (!response.ok) {
      alert("Could not record decision")
      return
    }

    setDecisionSubmitted(true)
    setUserDecision("verified")

    setRiskScore(null)
    setReasons([])
    setRiskLevel("")
    setRecommendation("")
    setIntervention("")
    setRiskConfirmed(false)
  }

  async function handleProceed() {
    const response = await fetch("http://localhost:3001/api/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analysisId,
        decision: "continued"
      })
    })

    if (!response.ok) {
      alert("Could not record decision")
      return
    }

    setDecisionSubmitted(true)
    setUserDecision("continued")

    setRiskConfirmed(false)
    alert("User chose to continue after seeing the warning.")
  }


  async function loadEvaluation() {
    try {
      const response = await fetch("http://localhost:3001/api/evaluation-data")

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      setEvaluation(result)
    } catch (error) {
      console.error("Error fetching evaluation data:", error)
    }
  }

  return (
    <div className="app-container">
      <div className="form-card">
        <h1>Payment Risk Checker</h1>
        <p>Check a payment request before sending money.</p>

        <div className="form-section">
          <p>Message</p>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Paste the suspicious message here"
          />
        </div>

        <div className="form-section">
          <p>Website</p>
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-section">
          <p>Payment Amount</p>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="2000"
          />
        </div>

        <div className="form-section">
          <p>Is this a new recipient?</p>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={newRecipient}
              onChange={(event) => setNewRecipient(event.target.checked)}
            />
            <span>New recipient</span>
          </label>
        </div>

        <div className="form-section">
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

        <button className="primary-button" onClick={handleAnalyse}>
          Analyse Payment
        </button>
      </div>

      {riskScore !== null && (
        <div className="result-card">
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

          <div className={getInterventionClass()}>
            <h3>Intervention</h3>
            <p>{intervention}</p>

            {intervention === "Confirmation required" && (
              <div className="intervention-actions">
                <button
                  className="secondary-button"
                  onClick={handleVerify}
                  disabled={decisionSubmitted}
                >
                  Go back and verify
                </button>

                <button
                  className="secondary-button"
                  onClick={handleProceed}
                  disabled={decisionSubmitted}
                >
                  I understand the risk
                </button>
              </div>
            )}

            {intervention === "Strong intervention" && (
              <div className="intervention-actions-wrap">
                <p>
                  This payment has multiple high-risk indicators. Confirm that you
                  understand the warning before continuing.
                </p>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={riskConfirmed}
                    onChange={(event) => setRiskConfirmed(event.target.checked)}
                  />
                  <span>I understand that this payment may be fraudulent</span>
                </label>

                <div className="intervention-actions">
                  <button
                    className="secondary-button"
                    onClick={handleVerify}
                    disabled={decisionSubmitted}
                  >
                    Go back and verify
                  </button>

                  <button
                    className="secondary-button"
                    onClick={handleProceed}
                    disabled={!riskConfirmed || decisionSubmitted}
                  >
                    Continue anyway
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="secondary-button" onClick={loadEvaluation}>
            View Evaluation Results
          </button>
        </div>
      )}

      {evaluation !== null && (
        <div className="evaluation-card">
          <h2>Evaluation Results</h2>

          <p>Total payments analysed: {evaluation.totalAnalyses}</p>
          <p>Total decisions: {evaluation.total}</p>
          <p>Went back to verify: {evaluation.verified}</p>
          <p>Continued anyway: {evaluation.continued}</p>
          <p>Overall verification rate: {evaluation.verifyRate}%</p>

          <h3>Interventions Triggered</h3>

          <p>
            No intervention: {evaluation.noIntervention} ({evaluation.noInterventionRate}%)
          </p>

          <p>
            Safety nudge: {evaluation.safetyNudge} ({evaluation.safetyNudgeRate}%)
          </p>

          <p>
            Warning: {evaluation.warning} ({evaluation.warningRate}%)
          </p>

          <p>
            Confirmation required: {evaluation.confirmationRequired} ({evaluation.confirmationRequiredRate}%)
          </p>

          <p>
            Strong intervention: {evaluation.strongIntervention} ({evaluation.strongInterventionRate}%)
          </p>

          <h3>Strong Intervention</h3>
          <p>Verification rate: {evaluation.strongVerifyRate}%</p>

          <h3>Confirmation Required</h3>
          <p>Verification rate: {evaluation.confirmationVerifyRate}%</p>
        </div>
      )}
    </div>
  )
}
export default App