import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistError } from './errors/user-already.exist-error';

interface registerServiceRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({ name, email, password }: registerServiceRequest) {
        const password_hash = await hash(password, 6);
    
        const ExistEmailUser = await this.usersRepository.findByEmail(email)
    
        if(ExistEmailUser) {
            throw new UserAlreadyExistError()
        }
    
        await this.usersRepository.create({
            name,
            email,
            password_hash
        });
    }
}
