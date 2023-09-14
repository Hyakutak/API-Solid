import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { RegisterUseCase } from '../register';

export function makeRegisterService() {
    const prismaUserRepository = new PrismaUserRepository();
    const registerService = new RegisterUseCase(prismaUserRepository);

    return registerService;
}