
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
    // 1. Clear old tokens
    await prisma.verificationToken.deleteMany({
        where: { identifier: 'ryan@fusionbydesign.co.za' }
    });
    console.log('Cleared old tokens.');

    // 2. Generate new token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 3. Insert
    // Note: NextAuth with Prisma Adapter usually stores the plain token if not configured otherwise.
    // We will store the plain token.
    await prisma.verificationToken.create({
        data: {
            identifier: 'ryan@fusionbydesign.co.za',
            token: token,
            expires: expires
        }
    });

    // 4. Construct URL
    const callbackUrl = encodeURIComponent('http://localhost:3000/dashboard');
    const link = `http://localhost:3000/api/auth/callback/resend?callbackUrl=${callbackUrl}&token=${token}&email=ryan%40fusionbydesign.co.za`;

    console.log('MANUALLY GENERATED LINK:');
    console.log(link);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
