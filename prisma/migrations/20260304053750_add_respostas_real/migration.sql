/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Professor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Professor` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "acertou" BOOLEAN NOT NULL,
    "questaoId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Resposta_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aluno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senhaTemp" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "professorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aluno_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Aluno" ("createdAt", "id", "isActive", "login", "nome", "professorId", "senhaTemp") SELECT "createdAt", "id", "isActive", "login", "nome", "professorId", "senhaTemp" FROM "Aluno";
DROP TABLE "Aluno";
ALTER TABLE "new_Aluno" RENAME TO "Aluno";
CREATE UNIQUE INDEX "Aluno_login_key" ON "Aluno"("login");
CREATE TABLE "new_Professor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Professor" ("email", "id", "nome", "senha") SELECT "email", "id", "nome", "senha" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
