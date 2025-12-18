import { Job } from 'bullmq';
import { prisma } from '@contentos/db';

export async function planProcessor(job: Job) {
    const { workspaceId, days = 7 } = job.data;
    console.log(`[PLAN] Generating schedule for workspace ${workspaceId} for next ${days} days`);

    // Logic: 
    // 1. Get workspace settings (prefs)
    // 2. Loop days
    // 3. Create ScheduleSlot entries if not exist

    // Mock logic
    const now = new Date();
    for (let i = 1; i <= days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        date.setHours(10, 0, 0, 0); // Default 10 AM

        await prisma.scheduleSlot.create({
            data: {
                workspaceId,
                platform: 'linkedin', // Mock
                time: date,
                isFilled: false
            }
        });
    }

    return { planned: days };
}
