-- CreateTable
CREATE TABLE "Usuario" (
    "IdUsuario" SERIAL NOT NULL,
    "NomeUsuario" TEXT NOT NULL,
    "EmailUsuario" TEXT NOT NULL,
    "SenhaUsuario" TEXT NOT NULL,
    "TipoUsuario" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("IdUsuario")
);
