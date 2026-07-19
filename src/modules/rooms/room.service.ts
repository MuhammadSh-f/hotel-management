import { AppError } from "../../utils/AppError";
import { Room } from "./room.model";

export interface CreateRoomInput {
  roomNum: number;
  roomType: string;
  price: number;
}

export const createRoom = async (data: CreateRoomInput) => {
  const existingRoom = await Room.findOne({ roomNum: data.roomNum });
  if (existingRoom) {
    throw new AppError(`Room ${data.roomNum} is already registered`, 409);
  }

  const newRoom = await Room.create({
    roomNum: data.roomNum,
    roomType: data.roomType,
    price: data.price,
  });

  return newRoom.toObject();
};

export const listRooms = async () => {
  return Room.find().sort({ roomNum: 1 }).lean();
};

export const getRoomById = async (id: string) => {
  const room = await Room.findById(id).lean();
  if (!room) {
    throw new AppError("Room not found", 404);
  }
  return room;
};
