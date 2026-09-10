/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Prescription` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "fileUrl",
ADD COLUMN     "aiExtractedData" JSONB,
ADD COLUMN     "aiFailureReason" TEXT,
ADD COLUMN     "aiProcessedAt" TIMESTAMP(3),
ADD COLUMN     "fileMimeType" TEXT,
ADD COLUMN     "originalFileName" TEXT,
ADD COLUMN     "originalFilePath" TEXT,
ADD COLUMN     "processingStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "prescribedBy" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PrescriptionAccessGrant" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "PrescriptionAccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrescriptionAccessGrant_professionalId_idx" ON "PrescriptionAccessGrant"("professionalId");

-- CreateIndex
CREATE INDEX "PrescriptionAccessGrant_prescriptionId_idx" ON "PrescriptionAccessGrant"("prescriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PrescriptionAccessGrant_prescriptionId_professionalId_key" ON "PrescriptionAccessGrant"("prescriptionId", "professionalId");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_processingStatus_idx" ON "Prescription"("processingStatus");

-- AddForeignKey
ALTER TABLE "PrescriptionAccessGrant" ADD CONSTRAINT "PrescriptionAccessGrant_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionAccessGrant" ADD CONSTRAINT "PrescriptionAccessGrant_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
