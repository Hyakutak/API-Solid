import { UsersRepository } from '@/repositories/users-repository';
import { User } from '@prisma/client';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { compare } from 'bcryptjs';

interface authenticateServiceRequest {
    email: string;
    password: string
}

interface authenticateServiceResponse {
    user: User
}

export class AuthenticateService {
    constructor(private userRepository: UsersRepository) {}

    async execute({ email, password }: authenticateServiceRequest): Promise<authenticateServiceResponse> {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new InvalidCredentialsError();
        }

        const doesPassowrdMatches = await compare(password, user.password_hash);

        if(!doesPassowrdMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        }
    }

}