import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let userRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Authenticate Service', () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository();
        sut = new AuthenticateService(userRepository);
    });
    it('should be able to authenticate', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 6)
        });

        const { user } = await sut.execute({
            email: 'john@example.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });
    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'john@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
    it('should not be able to authenticate with wrong password', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'john@example.com',
            password_hash: await hash('123456', 6)
        });

        await expect(() =>
            sut.execute({
                email: 'john@example.com',
                password: '1243456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});

