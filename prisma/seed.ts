import { PrismaClient } from "@prisma/client";

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: 'postgresql://postgres:QNWugPaKSKXbF-VU@host.docker.internal:5001/merch-incridea'
            }
        }
    })

    try {
        await prisma.$connect()
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Connection error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });