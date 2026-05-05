const Joi = require('joi');

const analysisSchema = Joi.object({
  question: Joi.string().trim().min(3).max(500).required(),

  responseText: Joi.string().trim().min(2).max(5000).required(),

  mode: Joi.string().valid('hr', 'group', 'casual', 'technical').default('hr'),

  // allow empty string — default it to 'anonymous' so empty userId never fails
  userId: Joi.string().trim().max(200).allow('').default('anonymous'),

  // sessionId can be absent, null, or a real string — never reject it
  sessionId: Joi.alternatives().try(
    Joi.string().max(200),
    Joi.valid(null, '')
  ).optional()
});

function validateAnalysis(req, res, next) {
  const { error, value } = analysisSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const details = error.details.map(d => d.message).join('; ');
    console.error('[Validate] ❌ Failed:', details);
    console.error('[Validate] Body received:', JSON.stringify(req.body));
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Ensure userId is never empty after trimming
  if (!value.userId) value.userId = 'anonymous';

  req.body = value;
  next();
}

module.exports = { validateAnalysis };
