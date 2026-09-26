const test = require('node:test')
const assert = require('node:assert/strict')

const { calculateRiskAnalysis } = require('./server.js')

test('Low risk payment returns score 0 with no intervention', () => {
  const result = calculateRiskAnalysis(
    'Thanks',
    'https://example.com',
    100,
    false,
    'Email'
  )

  assert.equal(result.score, 0)
  assert.equal(result.level, 'Low')
  assert.equal(result.intervention, 'No intervention')
})

test('Medium/high risk payment returns score 55 with warning intervention', () => {
  const result = calculateRiskAnalysis(
    'Send now',
    'https://example.com',
    1200,
    true,
    'WhatsApp'
  )

  assert.equal(result.score, 55)
  assert.equal(result.level, 'High')
  assert.equal(result.intervention, 'Warning')
})

test('Very high risk payment returns score 95 with strong intervention', () => {
  const result = calculateRiskAnalysis(
    'Send now, keep this secret',
    'payment.xyz',
    1200,
    true,
    'WhatsApp'
  )

  assert.equal(result.score, 95)
  assert.equal(result.level, 'Critical')
  assert.equal(result.intervention, 'Strong intervention')
})
