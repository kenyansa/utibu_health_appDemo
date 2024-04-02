/*
  Warnings:

  - You are about to drop the column `priceInCents` on the `Medication` table. All the data in the column will be lost.
  - Added the required column `priceInShillings` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePaidInShillings` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "priceInShillings" REAL NOT NULL,
    "filePath" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "isAvailableForPurchase" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Medication" ("createdAt", "description", "filePath", "id", "imagePath", "isAvailableForPurchase", "name", "quantity", "updatedAt") SELECT "createdAt", "description", "filePath", "id", "imagePath", "isAvailableForPurchase", "name", "quantity", "updatedAt" FROM "Medication";
DROP TABLE "Medication";
ALTER TABLE "new_Medication" RENAME TO "Medication";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "pricePaidInShillings" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "orderStatus", "patientId", "paymentStatus", "quantity", "updatedAt") SELECT "createdAt", "id", "orderStatus", "patientId", "paymentStatus", "quantity", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
