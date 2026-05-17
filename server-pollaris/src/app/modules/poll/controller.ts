import type { Request, Response } from "express";
import { db } from "../../../db/index.js";
import { eq } from "drizzle-orm";

import {
  pollsTable,
  questionsTable,
  optionsTable,
  answersTable,
  responsesTable,
} from "../../../db/schema.js";

import ApiError from "../../../common/utils/api.error.js";
import { createPollPayloadModel } from "./models.js";

class PollController {
  public handleCreate = async (req: Request, res: Response) => {
    const { title, description, isAnonymous, expiresAt, questions } = req.body;

    if (!title || !questions?.length) {
      return ApiError.badRequest("title and questions required");
    }

    // @ts-ignore
    const creatorId = req.user.id;

    const result = await db.transaction(async (tx) => {
      const [poll] = await tx
        .insert(pollsTable)
        .values({
          title,
          description,
          isAnonymous,
          expiresAt,

          creatorId,
        })
        .returning();
      if (!poll) {
        throw new Error("Poll creation failed");
      }

      for (const question of questions) {
        const [createdQuestion] = await tx
          .insert(questionsTable)
          .values({
            pollId: poll.id,

            questionText: question.questionText,

            isRequired: question.isRequired,

            orderIndex: question.orderIndex,
          })
          .returning();
        if (!createdQuestion) {
          throw new Error("Question creation failed");
        }

        if (question.options) {
          await tx.insert(optionsTable).values(
            question.options.map((option: any) => ({
              questionId: createdQuestion.id,

              optionText: option.optionText,
            })),
          );
        }
      }

      return poll;
    });

    return res.status(201).json({
      message: "poll created",

      data: result,
    });
  };

  public handleGetPoll = async (req: Request, res: Response) => {
    const { pollId } = req.params;
    if (!pollId || Array.isArray(pollId)) {
      return ApiError.badRequest("invalid poll id");
    }

    const poll = await db.query.pollsTable.findFirst({
      where: (polls, { eq }) => eq(polls.id, pollId),

      with: {
        questions: {
          with: {
            options: true,
          },
        },
      },
    });

    if (!poll) {
      return ApiError.notfound("poll not found");
    }

    return res.json({
      data: poll,
    });
  };

  public handleRespond = async (req: Request, res: Response) => {
    const pollId = req.params.pollId;

    if (!pollId || Array.isArray(pollId)) {
      return ApiError.badRequest("invalid poll id");
    }

    const poll = await db.query.pollsTable.findFirst({
      where: (polls, { eq }) => eq(polls.id, pollId),
    });

    if (!poll) {
      return ApiError.notfound("poll not found");
    }

    if (!poll.isAnonymous && !req.user) {
      return ApiError.unAuthorized("login required to vote on this poll");
    }

    if (req.user) {
      const userId = req.user.id;

      const existing = await db.query.responsesTable.findFirst({
        where: (responses, { eq, and }) =>
          and(
            eq(responses.pollId, pollId),

            eq(responses.userId, userId),
          ),
      });

      if (existing) {
        return ApiError.badRequest("already voted");
      }
    }

    const validationResult = await createPollPayloadModel.safeParseAsync(
      req.body,
    );

    const { answers } = req.body;

    if (!answers || !answers.length) {
      return ApiError.badRequest("answers required");
    }

    const result = await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(responsesTable)
        .values({
          pollId,

          // @ts-ignore
          userId: req.user?.id ?? null,
        })
        .returning();

      if (!response) {
        throw new Error("response create failed");
      }

      await tx.insert(answersTable).values(
        answers.map((answer: any) => ({
          responseId: response.id,

          questionId: answer.questionId,

          selectedOptionId: answer.selectedOptionId,
        })),
      );

      return response;
    });

    return res.status(201).json({
      message: "response submitted",

      data: result,
    });
  };
}

export default PollController;
