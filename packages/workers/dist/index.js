import { Worker } from 'bullmq';
import { planProcessor } from './processors/plan';
import { generateProcessor } from './processors/generate';
import { publishProcessor } from './processors/publish';
import { urlScanProcessor } from './processors/url-scan';
import { authorityImageProcessor } from './processors/authority-image';
import { shortsGeneratorProcessor } from './processors/shorts-generator';
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
};
export function startWorkers() {
    console.log("Starting ContentOS Workers...");
    new Worker('PLAN', planProcessor, { connection });
    new Worker('GENERATE', generateProcessor, { connection });
    new Worker('PUBLISH', publishProcessor, { connection });
    new Worker('URL_SCAN', urlScanProcessor, { connection });
    new Worker('AUTHORITY_IMAGE', authorityImageProcessor, { connection });
    new Worker('SHORTS_GENERATOR', shortsGeneratorProcessor, { connection });
    console.log("Workers started: PLAN, GENERATE, PUBLISH, URL_SCAN, AUTHORITY_IMAGE, SHORTS_GENERATOR");
}
// Auto-start if run directly
if (require.main === module) {
    startWorkers();
}
