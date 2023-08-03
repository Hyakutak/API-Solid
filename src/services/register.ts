import { prisma } from '@/lib/prisma';
import { PrismaUserRepository } from '@/repositories/prisma-user-repository';
import { hash } from 'bcryptjs';

interface registerService {
    name: string;
    email: string;
    password: string;
}

export async function registerService({ name, email, password }: registerService) {
    const password_hash = await hash(password, 6);

    const ExistEmailUser = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if(ExistEmailUser) {
        throw new Error('E-mail already exist.');
    }

    const prismaUserRepository = new PrismaUserRepository();

    await prismaUserRepository.create({
        name,
        email,
        password_hash
    });
}