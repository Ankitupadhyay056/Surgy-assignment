const { z } = require("zod");

const patientSchema = z.object({
  name: z.string().min(2),
  triageLevel: z.number().min(1).max(5),
});

module.exports = patientSchema;
