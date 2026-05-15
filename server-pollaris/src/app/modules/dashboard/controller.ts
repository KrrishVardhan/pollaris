import type { Request, Response } from "express";

import { db } from "../../../db/index.js";

import { pollsTable } from "../../../db/schema.js";

import { eq } from "drizzle-orm";

class DashboardController {
  public handleDashboard = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const polls = await db
      .select()
      .from(pollsTable)
      .where(eq(pollsTable.creatorId, userId));

    const responses = await db.query.responsesTable.findMany({
      where: (responses, { inArray }) =>
        inArray(
          responses.pollId,
          polls.map((p) => p.id),
        ),
    });

    return res.json({
      totalPolls: polls.length,

      totalResponses: responses.length,

      activePolls: polls.filter((p) => !p.expiresAt).length,

      polls,
    });
  };
}

export default DashboardController;
