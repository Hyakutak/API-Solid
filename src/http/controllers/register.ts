import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterUseCase } from '@/services/register';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { error } from 'console';
import { UserAlreadyExistError } from '@/services/errors/user-already.exist-error';
import { makeRegisterService } from '@/services/factories/make-register-service';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
        const registerUseCase = makeRegisterService();

        await registerUseCase.execute({ name, email, password });
    } catch (err) {
        if(err instanceof UserAlreadyExistError ) {
            return reply.status(409).send({ message: err.message });
        }

        throw err
    }

    return reply.status(201).send();
}