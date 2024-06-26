import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { deleteStableCoin } from "@/lib/hedera";
import { SDeleteCoin } from "@/schemas/coin/delete";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete(
    "/",
    validateRequest({ query: SDeleteCoin }),
    errorHandler(async (req, res) => {
      const body = req.query;
      const message = await deleteStableCoin(body);
      res.status(200).json({ data: message });
    })
  );

  return router;
};
