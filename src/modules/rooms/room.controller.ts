import { Request, Response } from "express";
import { createRoom, listRooms, getRoomById } from "./room.service";

export const createRoomHandler = async (req: Request, res: Response) => {
  const room = await createRoom(req.body);
  res.status(201).json(room);
};

export const listRoomsHandler = async (_req: Request, res: Response) => {
  const rooms = await listRooms();
  res.json(rooms);
};

export const getRoomHandler = async (req: Request, res: Response) => {
  const room = await getRoomById(req.params.id as string);
  res.json(room);
};
