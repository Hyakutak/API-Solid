import { describe, it, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistError } from './errors/user-already.exist-error';

describe('Register Service', () => {
    it('should be able to register', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerSevice = new RegisterUseCase(userRepository);

        const { user } = await registerSevice.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });
    it('should hash user password upon registration', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerSevice = new RegisterUseCase(userRepository);

        const { user } = await registerSevice.execute({
            name: 'John Doe',
            email: 'john@example.com',
            password: '123456'
        });

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });
    it('should not be able to register with same email twice', async () => {
        const userRepository = new InMemoryUsersRepository();
        const registerSevice = new RegisterUseCase(userRepository);

        const email = 'john@example.com';

        await registerSevice.execute({
            name: 'John Doe',
            email,
            password: '123456'
        });

        await expect(() => 
            registerSevice.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistError);
    });
});

