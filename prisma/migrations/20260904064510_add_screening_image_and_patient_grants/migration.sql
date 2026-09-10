-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "facialImagePath" TEXT;

-- CreateTable
CREATE TABLE "PatientAccessGrant" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "PatientAccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientAccessGrant_professionalId_idx" ON "PatientAccessGrant"("professionalId");

-- CreateIndex
CREATE INDEX "PatientAccessGrant_patientId_idx" ON "PatientAccessGrant"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAccessGrant_patientId_professionalId_key" ON "PatientAccessGrant"("patientId", "professionalId");

-- AddForeignKey
ALTER TABLE "PatientAccessGrant" ADD CONSTRAINT "PatientAccessGrant_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAccessGrant" ADD CONSTRAINT "PatientAccessGrant_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
