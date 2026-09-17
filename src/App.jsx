import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

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

  function handleAnalyse() {
    let hostname = ""

if (website !== "") {
  try {
    const websiteURL = new URL(website)
    hostname = websiteURL.hostname.toLowerCase()
  } catch {
    riskReasons.push("Website address is not valid")
    score = score + 5
  }
}
  let score = 0
  let riskReasons = []

  const lowerMessage = message.toLowerCase()
  const lowerWebsite = website.toLowerCase()


const paymentAmount = Number(amount)

if (paymentAmount >= 5000) {
  score = score + 20
  riskReasons.push("Very high-value payment")
} else if (paymentAmount >= 1000) {
  score = score + 10
  riskReasons.push("High-value payment")
} else if (paymentAmount >= 500) {
  score = score + 5
  riskReasons.push("Moderate-value payment")
}

  if (newRecipient) {
    score = score + 15
    riskReasons.push("New recipient")
  }

if (newRecipient && paymentAmount >= 1000) {
  score = score + 10
  riskReasons.push("Large payment to a new recipient")
}
const suspiciousCategories = [
  {
    name: "Urgency",
    words: ["urgen", "immediate", "act now", "send now"],
    points: 15
  },

  {
    name: "Secrecy",
    words: ["do not tell", "don't tell", "confidential", "secret"],
    points: 20
  },

  {
    name: "Financial Threat",
    words: ["account frozen", "account suspended", "money at risk"],
    points: 20
  }
]
for (let i = 0; i < suspiciousCategories.length; i++) {
  const currentCategory = suspiciousCategories[i]
    for (let j = 0; j < currentCategory.words.length; j++) {
        const currentWord = currentCategory.words[j]
        if (
  lowerMessage.includes(currentWord) ||
  lowerMessage.includes(currentCategory.name.toLowerCase())
) {
  score = score + currentCategory.points
  riskReasons.push(currentCategory.name + " language detected")
  break
}
    }
}

const websiteSignals = [
  {
    value: ".xyz",
    points: 20,
    reason: "Unusual domain ending detected"
  },
  {
    value: "login",
    points: 10,
    reason: "Login-related wording detected in website"
  },
  {
    value: "verify",
    points: 10,
    reason: "Verification wording detected in website"
  },
  {
    value: "secure",
    points: 10,
    reason: "Security-related wording detected in website"
  }
]
for (let i = 0; i < websiteSignals.length; i++) {
  if (lowerWebsite.includes(websiteSignals[i].value)) {
    score = score + websiteSignals[i].points

    riskReasons.push(
      websiteSignals[i].reason
    )
  }
}
const brands = [
  {
    name: "barclays",
    officialDomain: "barclays.co.uk"
  },
  {
    name: "paypal",
    officialDomain: "paypal.com"
  },
  {
    name: "amazon",
    officialDomain: "amazon.co.uk"
  }
]

for (let i = 0; i < brands.length; i++) {

  const brand = brands[i]

  if (
    lowerMessage.includes(brand.name) &&
    website !== "" &&
    !lowerWebsite.includes(brand.officialDomain)
  ) {
    score = score + 20

    riskReasons.push(
      "Possible " + brand.name + " impersonation detected"
    )
  }
}
for (let i = 0; i < brands.length; i++) {
  const brand = brands[i]

  if (
    lowerMessage.includes(brand.name) &&
    hostname !== "" &&
    hostname !== brand.officialDomain &&
    !hostname.endsWith("." + brand.officialDomain)
  ) {
    score = score + 20

    riskReasons.push(
      "Possible " + brand.name + " impersonation detected"
    )
  }
}
score = Math.min(score, 100)

  let level = ""
  let advice = ""

  if (score < 30) {
    level = "Low"
    advice = "No major warning signs detected, but still verify the request."
  } else if (score < 50) {
    level = "Medium"
    advice = "Pause and verify the request before sending money."
  } else if (score < 70) {
    level = "High"
    advice = "Do not send money until you have independently verified the request."
  } else {
    level = "Critical"
    advice = "Stop the payment and verify the request using a trusted contact method."
  }

  if (
    (channel === "WhatsApp" || channel === "Telegram") &&
    newRecipient
    ) {
    score = score + 5
    riskReasons.push("New recipient contacted through a messaging app")
    }

  setRiskScore(score)
  setReasons(riskReasons)
  setRiskLevel(level)
  setRecommendation(advice)
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
    <p>Is this a new recipient?</p>

    <label>
    <input
        type="checkbox"
        checked={newRecipient}
        onChange={(event) => setNewRecipient(event.target.checked)}
    />

    New recipient
    </label>

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

    {riskScore !== null && (
  <div>
    <h2>Risk Score</h2>

    <p>{riskScore} / 100</p>

    <h3>Risk Level</h3>

    <p>{riskLevel}</p>

    <h3>Detected Risks</h3>

    <ul>
      {reasons.map((reason, index) => (
        <li key={index}>{reason}</li>
      ))}
    </ul>

    <h3>Recommended Action</h3>

    <p>{recommendation}</p>
  </div>
)}
    </div>

    
  )
}

export default App