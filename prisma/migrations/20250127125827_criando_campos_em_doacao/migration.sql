-- AlterTable
ALTER TABLE "Doacao" ADD COLUMN     "DataAgendada" TIMESTAMP(3),
ADD COLUMN     "DataRetirada" TIMESTAMP(3),
ADD COLUMN     "StatusDoacao" INTEGER NOT NULL DEFAULT 0;
