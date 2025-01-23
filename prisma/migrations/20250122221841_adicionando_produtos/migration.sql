-- CreateTable
CREATE TABLE "Produto" (
    "IdProduto" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "UN" VARCHAR(20) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("IdProduto")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_Nome_key" ON "Produto"("Nome");
