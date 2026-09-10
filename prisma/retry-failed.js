const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Reset all FAILED prescriptions back to PROCESSING so they get re-parsed on next upload
  const failed = await p.prescription.findMany({
    where: { processingStatus: 'FAILED' },
    select: { id: true, originalFileName: true, aiFailureReason: true }
  });
  
  console.log(`Found ${failed.length} failed prescription(s):`);
  failed.forEach(f => console.log(`  - ${f.id} (${f.originalFileName}): ${f.aiFailureReason}`));

  if (failed.length === 0) {
    console.log('Nothing to retry.');
    return;
  }

  // Reset them to PROCESSING so the UI shows "processing" instead of "failed"
  const result = await p.prescription.updateMany({
    where: { processingStatus: 'FAILED' },
    data: { 
      processingStatus: 'PROCESSING',
      aiFailureReason: null,
      aiExtractedData: undefined,
      aiProcessedAt: null
    }
  });
  
  console.log(`Reset ${result.count} prescription(s) to PROCESSING state.`);
  console.log('Delete the old one and re-upload, or add a re-parse API endpoint.');
}

main().catch(console.error).finally(() => p.$disconnect());
