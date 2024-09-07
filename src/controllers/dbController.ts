import prisma from "../client";
import { Request, RequestHandler, Response } from "express";

interface dbController {
  getSchedule: RequestHandler;
}

const dbController = {
  async getSchedule(req: Request, res: Response) {
    try {
      console.log("Attempting to connect to database...");
      const today = new Date().toISOString().split("T")[0];

      const existingSchedule = await prisma.schedule.findFirst();
      console.log("Existing Schedule:", existingSchedule);

      if (existingSchedule) {
        if (existingSchedule.releaseDay === today) {
          return res.status(200).json(existingSchedule);
        }

        const updatedSchedule = await prisma.schedule.update({
          where: { id: existingSchedule.id },
          data: { releaseDay: today },
        });

        return res.status(200).json(updatedSchedule);
      }

      const createdSchedule = await prisma.schedule.create({
        data: { releaseDay: today },
      });

      res.status(201).json(createdSchedule);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: "Error processing schedule" });
    }
  },
};

export default dbController;
