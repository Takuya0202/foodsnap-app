/*
  Warnings:

  - The primary key for the `genres` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `genres` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `prefectures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `prefectures` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `store_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `prefecture_id` column on the `stores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `genre_id` column on the `stores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tags` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `tag_id` on the `store_tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."store_tags" DROP CONSTRAINT "store_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stores" DROP CONSTRAINT "stores_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."stores" DROP CONSTRAINT "stores_prefecture_id_fkey";

-- AlterTable
ALTER TABLE "public"."genres" DROP CONSTRAINT "genres_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."prefectures" DROP CONSTRAINT "prefectures_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "prefectures_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."store_tags" DROP CONSTRAINT "store_tags_pkey",
DROP COLUMN "tag_id",
ADD COLUMN     "tag_id" INTEGER NOT NULL,
ADD CONSTRAINT "store_tags_pkey" PRIMARY KEY ("store_id", "tag_id");

-- AlterTable
ALTER TABLE "public"."stores" DROP COLUMN "prefecture_id",
ADD COLUMN     "prefecture_id" INTEGER,
DROP COLUMN "genre_id",
ADD COLUMN     "genre_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_tags_store_id_tag_id_key" ON "public"."store_tags"("store_id", "tag_id");

-- AddForeignKey
ALTER TABLE "public"."stores" ADD CONSTRAINT "stores_prefecture_id_fkey" FOREIGN KEY ("prefecture_id") REFERENCES "public"."prefectures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stores" ADD CONSTRAINT "stores_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_tags" ADD CONSTRAINT "store_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
