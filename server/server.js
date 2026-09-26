const express = require("express")
const cors = require("cors")

const app = express()
let decisions = [], analyses = [], nextAnalysisId = 1

app.use(cors())
app.use(express.json())

   function handleMessage(message) {
    let riskReasons = []
    let score = 0

    const lowerMessage = message.toLowerCase()

    const suspiciousCategories = [
      {
        name: "Urgency",
        words: [
          "urgen",
          "immediat",
          "act now",
          "send now"
        ],
        points: 15
      },

      {
        name: "Secrecy",
        words: [
          "do not tell",
          "don't tell",
          "confidential",
          "secret"
        ],
        points: 20
      },

      {
        name: "Financial threat",
        words: [
          "account frozen",
          "account suspended",
          "money at risk"
        ],
        points: 20
      }
    ]

    for (let i = 0; i < suspiciousCategories.length; i++) {
      const currentCategory = suspiciousCategories[i]

      for (let j = 0; j < currentCategory.words.length; j++) {
        const currentWord = currentCategory.words[j]

        if (
          lowerMessage.includes(currentWord) ||
          lowerMessage.includes(
            currentCategory.name.toLowerCase()
          )
        ) {
          score = score + currentCategory.points

          riskReasons.push(
            currentCategory.name + " language detected"
          )

          break
        }
      }
    }

    return {
      score: score,
      riskScoreReasons: riskReasons
    }
  }

   function handleWebsite(message, website) {
    let score = 0
    let riskReasons = []
    let hostname = ""

    const lowerMessage = message.toLowerCase()

    let normalisedWebsite = website.trim()

    if (
      normalisedWebsite !== "" &&
      !normalisedWebsite.startsWith("http://") &&
      !normalisedWebsite.startsWith("https://")
    ) {
      normalisedWebsite =
        "https://" + normalisedWebsite
    }

    const lowerWebsite =
      normalisedWebsite.toLowerCase()

    if (normalisedWebsite !== "") {
      try {
        const websiteURL =
          new URL(normalisedWebsite)

        hostname =
          websiteURL.hostname.toLowerCase()
      } catch {
        score = score + 5

        riskReasons.push(
          "Website address is not valid"
        )
      }
    }

    const websiteSignals = [
      {
        value: ".xyz",
        points: 20,
        reason:
          "Unusual domain ending detected"
      },

      {
        value: "login",
        points: 10,
        reason:
          "Login-related wording detected in website"
      },

      {
        value: "verify",
        points: 10,
        reason:
          "Verification wording detected in website"
      },

      {
        value: "secure",
        points: 10,
        reason:
          "Security-related wording detected in website"
      }
    ]

    for (let i = 0;i < websiteSignals.length;i++) {
      const currentSignal = websiteSignals[i]

      if (
        lowerWebsite.includes(
          currentSignal.value
        )
      ) {
        score =
          score + currentSignal.points

        riskReasons.push(
          currentSignal.reason
        )
      }
    }

    const brands = [
      {
        name: "barclays",
        officialDomain:
          "barclays.co.uk"
      },

      {
        name: "paypal",
        officialDomain:
          "paypal.com"
      },

      {
        name: "amazon",
        officialDomain:
          "amazon.co.uk"
      }
    ]

    for (
      let i = 0;
      i < brands.length;
      i++
    ) {
      const brand = brands[i]

      if (
        lowerMessage.includes(
          brand.name
        ) &&
        hostname !== "" &&
        hostname !==
          brand.officialDomain &&
        !hostname.endsWith(
          "." + brand.officialDomain
        )
      ) {
        score = score + 20

        riskReasons.push(
          "Possible " +
            brand.name +
            " impersonation detected"
        )
      }
    }

    return {
      score: score,
      riskScoreReasons: riskReasons
    }
  }

   function handlePayment(amount, newRecipient) {
    let score = 0
    let riskReasons = []

    const paymentAmount =
      Number(amount)

    if (paymentAmount >= 5000) {
      score = score + 20

      riskReasons.push(
        "Very high-value payment"
      )
    } else if (
      paymentAmount >= 1000
    ) {
      score = score + 10

      riskReasons.push(
        "High-value payment"
      )
    } else if (
      paymentAmount >= 500
    ) {
      score = score + 5

      riskReasons.push(
        "Moderate-value payment"
      )
    }

    if (newRecipient) {
      score = score + 15

      riskReasons.push(
        "New recipient"
      )
    }

    if (
      newRecipient &&
      paymentAmount >= 1000
    ) {
      score = score + 10

      riskReasons.push(
        "Large payment to a new recipient"
      )
    }

    return {
      score: score,
      riskScoreReasons: riskReasons
    }
  }

   function handleChannel(channel, newRecipient) {
    let score = 0
    let riskReasons = []

    if (
      (
        channel === "WhatsApp" ||
        channel === "Telegram"
      ) &&
      newRecipient
    ) {
      score = score + 5

      riskReasons.push(
        "New recipient contacted through a messaging app"
      )
    }

    return {
      score: score,
      riskScoreReasons: riskReasons
    }
  }


function calculateRiskAnalysis(message, website, amount, newRecipient, channel) {
  if (typeof message !== "string" || typeof website !== "string") {
    throw new Error("Invalid message or website")
  }

  const messageResult = handleMessage(message)
  const websiteResult = handleWebsite(message, website)
  const paymentResult = handlePayment(amount, newRecipient)
  const channelResult = handleChannel(channel, newRecipient)

  let score = 0
  let riskReasons = []

  score =
    score +
    messageResult.score +
    websiteResult.score +
    paymentResult.score +
    channelResult.score

  for (let i = 0; i < messageResult.riskScoreReasons.length; i++) {
    riskReasons.push(messageResult.riskScoreReasons[i])
  }

  for (let i = 0; i < websiteResult.riskScoreReasons.length; i++) {
    riskReasons.push(websiteResult.riskScoreReasons[i])
  }

  for (let i = 0; i < paymentResult.riskScoreReasons.length; i++) {
    riskReasons.push(paymentResult.riskScoreReasons[i])
  }

  for (let i = 0; i < channelResult.riskScoreReasons.length; i++) {
    riskReasons.push(channelResult.riskScoreReasons[i])
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

  let intervention = ""

  if (score < 30) {
    intervention = "No intervention"
  } else if (score < 50) {
    intervention = "Safety nudge"
  } else if (score < 70) {
    intervention = "Warning"
  } else if (score < 85) {
    intervention = "Confirmation required"
  } else {
    intervention = "Strong intervention"
  }

  return { score, riskReasons, level, advice, intervention }
}

app.post("/api/analyse", (req, res) => {
  const { message, website, amount, newRecipient, channel } = req.body

  if (typeof message !== "string" || typeof website !== "string") {
    return res.status(400).json({ error: "Invalid message or website" })
  }

  try {
    const analysisResult = calculateRiskAnalysis(message, website, amount, newRecipient, channel)
    const { score, riskReasons, level, advice, intervention } = analysisResult

    const analysisId = nextAnalysisId
    nextAnalysisId = nextAnalysisId + 1

    const analysisRecord = {
      id: analysisId,
      score,
      level,
      intervention,
      riskReasons,
      time: new Date()
    }

    analyses.push(analysisRecord)

    res.json({ analysisId, score, riskReasons, level, advice, intervention })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

app.post("/api/decision", (req, res) => {
  const { analysisId, decision } = req.body
  let matchedAnalysis = null

  if (typeof analysisId !== "number") {
    return res.status(400).json({ error: "Invalid analysis ID" })
  }

  if (decision !== "verified" && decision !== "continued") {
    return res.status(400).json({ error: "Invalid decision" })
  }

  for (let i = 0; i < analyses.length; i++) {
    if (analyses[i].id === analysisId) {
      matchedAnalysis = analyses[i]
      break
    }
  }

  if (matchedAnalysis === null) {
    return res.status(404).json({ error: "Analysis not found" })
  }

  for (let i = 0; i < decisions.length; i++) {
    if (decisions[i].analysisId === analysisId) {
      return res.status(409).json({ error: "Decision already recorded" })
    }
  }

  const decisionRecord = {
    analysisId,
    decision,
    score: matchedAnalysis.score,
    intervention: matchedAnalysis.intervention,
    time: new Date()
  }

  decisions.push(decisionRecord)

  res.json({ success: true })
})

app.get("/api/decisions", (req, res) => {
  res.json(decisions)
})

app.get("/api/evaluation", (req, res) => {
  let noIntervention = 0, safetyNudge = 0, warning = 0
  let confirmationRequired = 0, strongIntervention = 0

  for (let i = 0; i < analyses.length; i++) {
    const currentAnalysis = analyses[i]

    if (currentAnalysis.intervention === "No intervention") {
      noIntervention = noIntervention + 1
    } else if (currentAnalysis.intervention === "Safety nudge") {
      safetyNudge = safetyNudge + 1
    } else if (currentAnalysis.intervention === "Warning") {
      warning = warning + 1
    } else if (currentAnalysis.intervention === "Confirmation required") {
      confirmationRequired = confirmationRequired + 1
    } else if (currentAnalysis.intervention === "Strong intervention") {
      strongIntervention = strongIntervention + 1
    }
  }

  const totalAnalyses = analyses.length
  const noInterventionRate = totalAnalyses > 0 ? Math.round((noIntervention / totalAnalyses) * 100) : 0
  const safetyNudgeRate = totalAnalyses > 0 ? Math.round((safetyNudge / totalAnalyses) * 100) : 0
  const warningRate = totalAnalyses > 0 ? Math.round((warning / totalAnalyses) * 100) : 0
  const confirmationRequiredRate = totalAnalyses > 0 ? Math.round((confirmationRequired / totalAnalyses) * 100) : 0
  const strongInterventionRate = totalAnalyses > 0 ? Math.round((strongIntervention / totalAnalyses) * 100) : 0

  const total = decisions.length
  const verified = decisions.filter((decision) => decision.decision === "verified").length
  const continued = decisions.filter((decision) => decision.decision === "continued").length
  const verifyRate = total === 0 ? 0 : Math.round((verified / total) * 100)

  const strongAnalysisIds = analyses
    .filter((analysis) => analysis.intervention === "Strong intervention")
    .map((analysis) => analysis.id)

  const strongDecisionCount = decisions.filter((decision) =>
    strongAnalysisIds.includes(decision.analysisId)
  ).length

  const strongVerifiedCount = decisions.filter((decision) =>
    strongAnalysisIds.includes(decision.analysisId) && decision.decision === "verified"
  ).length

  const strongVerifyRate = strongDecisionCount === 0 ? 0 : Math.round((strongVerifiedCount / strongDecisionCount) * 100)

  const confirmationAnalysisIds = analyses
    .filter((analysis) => analysis.intervention === "Confirmation required")
    .map((analysis) => analysis.id)

  const confirmationDecisionCount = decisions.filter((decision) =>
    confirmationAnalysisIds.includes(decision.analysisId)
  ).length

  const confirmationVerifiedCount = decisions.filter((decision) =>
    confirmationAnalysisIds.includes(decision.analysisId) && decision.decision === "verified"
  ).length

  const confirmationVerifyRate = confirmationDecisionCount === 0 ? 0 : Math.round((confirmationVerifiedCount / confirmationDecisionCount) * 100)

  res.json({
    totalAnalyses,
    total,
    verified,
    continued,
    verifyRate,
    strongVerifyRate,
    confirmationVerifyRate,
    noIntervention,
    safetyNudge,
    warning,
    confirmationRequired,
    strongIntervention,
    noInterventionRate,
    safetyNudgeRate,
    warningRate,
    confirmationRequiredRate,
    strongInterventionRate
  })
})

app.get("/api/evaluation-data", (req, res) => {
  res.redirect(307, "/api/evaluation")
})

if (require.main === module) {
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001")
  })
}

module.exports = {
  app,
  calculateRiskAnalysis,
  handleMessage,
  handleWebsite,
  handlePayment,
  handleChannel
}