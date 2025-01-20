-- CreateTable
CREATE TABLE "Doador" (
    "IdDoador" SERIAL NOT NULL,
    "CPFCNPJ" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "Rua" TEXT NOT NULL,
    "Numero" TEXT NOT NULL,
    "Bairro" TEXT NOT NULL,
    "Complemento" TEXT,

    CONSTRAINT "Doador_pkey" PRIMARY KEY ("IdDoador")
);

-- CreateTable
CREATE TABLE "Contato" (
    "IdContato" SERIAL NOT NULL,
    "IdDoador" INTEGER NOT NULL,
    "Contato" TEXT,
    "Telefone" TEXT,
    "Email" TEXT,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("IdContato")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doador_CPFCNPJ_key" ON "Doador"("CPFCNPJ");
