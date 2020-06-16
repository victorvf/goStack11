import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    password?: string;
    old_password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'This user does not exists, check your credentials',
            );
        }

        const userWiththeSameEmail = await this.usersRepository.findByEmail(
            email,
        );

        if (userWiththeSameEmail && userWiththeSameEmail.id !== user_id) {
            throw new AppError('User with the same email email already exists');
        }

        Object.assign(user, { name, email });

        if (password && !old_password) {
            throw new AppError(
                "User can't change the password without pass the old_password",
            );
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError(
                    'Old_password does not match, check your credential',
                );
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
