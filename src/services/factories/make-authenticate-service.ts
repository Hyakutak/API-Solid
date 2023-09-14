import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { AuthenticateService } from '../authenticate';

export function makeAuthenticateSerivce() {
    const prismaUserRepository = new PrismaUserRepository();
    const authenticateService = new AuthenticateService(prismaUserRepository);

    return authenticateService;
}