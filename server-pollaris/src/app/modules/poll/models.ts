import { z } from "zod";

export const createPollPayloadModel = z.object({
  title: z.string(),

  description: z.string().optional(),

  isAnonymous: z.boolean(),

  questions: z.array(
    z.object({
      questionText: z.string(),

      isRequired: z.boolean(),

      orderIndex: z.number(),

      options: z.array(
        z.object({
          optionText: z.string(),
        }),
      ),
    }),
  ),
});
