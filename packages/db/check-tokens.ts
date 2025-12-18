
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tokens = await prisma.verificationToken.findMany();
    console.log('Tokens count:', tokens.length);
    console.log('Tokens:', tokens);

    const users = await prisma.user.findMany();
    console.log('Users:', users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
