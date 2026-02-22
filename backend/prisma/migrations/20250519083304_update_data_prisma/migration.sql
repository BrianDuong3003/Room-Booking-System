/*
  Warnings:

  - A unique constraint covering the columns `[roomScheduleId,status]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `version` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `bookings_roomScheduleId_status_key` ON `bookings`(`roomScheduleId`, `status`);
