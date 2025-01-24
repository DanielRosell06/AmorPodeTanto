-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "UN" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Doacao" (
    "IdDoacao" SERIAL NOT NULL,
    "IdDoador" INTEGER NOT NULL,
    "DataDoacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("IdDoacao")
);

-- CreateTable
CREATE TABLE "DoacaoItem" (
    "IdDoacaoItem" SERIAL NOT NULL,
    "IdDoacao" INTEGER NOT NULL,
    "IdProduto" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "UNItem" VARCHAR(20),

    CONSTRAINT "DoacaoItem_pkey" PRIMARY KEY ("IdDoacaoItem")
);
