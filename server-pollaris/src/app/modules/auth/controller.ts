import type { Response, Request } from "express";
import { registerPayloadModel, loginPayloadModel } from "./models.js";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { createHmac, randomBytes } from "node:crypto";
import ApiError from "../../../common/utils/api.error.js";
import { createUserToken } from "../../../common/utils/jwt.js";

class AuthenticationController {
  public handleRegister = async (req: Request, res: Response) => {
    const validationResult = await registerPayloadModel.safeParseAsync(
      req.body,
    );

    if (validationResult.error) {
      return ApiError.badRequest("request body validation failed successfully");
    }
    const { username, email, password } = validationResult.data;

    const userEmailResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (userEmailResult.length > 0) {
      return res.status(400).json({
        message: `user with email ${email} already exists`,
        error: "duplicate entry",
      });
    }

    // if everything work correctly
    const salt = randomBytes(32).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const result = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hash,
        salt,
      })
      .returning({ id: usersTable.id });

    return res.status(201).json({
      message: "user has been created successfully",
      data: { id: result[0]?.id },
      result: result,
    });
  };

  public handleLogin = async (req: Request, res: Response) => {
    const validationResult = await loginPayloadModel.safeParseAsync(req.body);
    if (validationResult.error) {
      return ApiError.badRequest("request body validation failed successfully");
    }
    const { email, password } = validationResult.data;

    const [userSelect] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!userSelect) {
      return ApiError.notfound(`user with ${email} doesnt exist`);
    }

    // if everything works
    const salt = userSelect.salt!;
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    // console.log("Stored:", userSelect.password);
    // console.log("Generated:", hash);
    // console.log("Equal?", userSelect.password === hash);
    // console.log("Entered password:", password);
    if (userSelect.password !== hash) {
      return ApiError.unAuthorized("Invalid credentials");
    }

    // * Access token
    const token = createUserToken({ id: userSelect.id });

    return res.json({ message: "Login success", data: { token: token } });
  };
}

export default AuthenticationController;
