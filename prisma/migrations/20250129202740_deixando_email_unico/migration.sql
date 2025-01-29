/*
  Warnings:

  - A unique constraint covering the columns `[EmailUsuario]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Usuario_EmailUsuario_key" ON "Usuario"("EmailUsuario");
