import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { AuthenticateService } from '@/services/authenticate';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const prismaUserRepository = new PrismaUserRepository();
        const authenticateService = new AuthenticateService(prismaUserRepository);

        await authenticateService.execute({ email, password });
    } catch (err) {
        if(err instanceof InvalidCredentialsError ) {
            return reply.status(400).send({ message: err.message });
        }

        throw err
    }

    return reply.status(200).send();
}