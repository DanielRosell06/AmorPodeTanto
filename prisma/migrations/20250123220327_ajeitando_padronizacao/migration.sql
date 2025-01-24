/*
  Warnings:

  - You are about to drop the column `quantidade` on the `DoacaoItem` table. All the data in the column will be lost.
  - Added the required column `Quantidade` to the `DoacaoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoacaoItem" DROP COLUMN "quantidade",
ADD COLUMN     "Quantidade" INTEGER NOT NULL;
