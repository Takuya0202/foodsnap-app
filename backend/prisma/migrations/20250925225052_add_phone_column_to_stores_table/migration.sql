/*
  Warnings:

  - Added the required column `phone` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "phone" VARCHAR(32) NOT NULL;
