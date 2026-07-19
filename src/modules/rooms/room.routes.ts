import { Router } from "express";
import {
  createRoomHandler,
  listRoomsHandler,
  getRoomHandler,
} from "./room.controller";
import { validateRequest } from "../../middleware/validate";
import { verifyToken, restrictTo } from "../../middleware/auth.middleware";
import { createRoomSchema } from "./room.validation";

const router = Router();

router.get("/", listRoomsHandler);
router.get("/:id", getRoomHandler);

// Only authenticated admins may register rooms.
router.post(
  "/",
  verifyToken,
  restrictTo("admin"),
  validateRequest(createRoomSchema),
  createRoomHandler,
);

export default router;
