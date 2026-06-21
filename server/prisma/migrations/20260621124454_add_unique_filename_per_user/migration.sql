/*
  Warnings:

  - A unique constraint covering the columns `[user_id,original_name]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "files_user_id_original_name_key" ON "public"."files"("user_id", "original_name");
