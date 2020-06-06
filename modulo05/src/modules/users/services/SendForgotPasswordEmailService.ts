import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

// import User from '../infra/typeorm/entities/User';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmail {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (!userExists) {
            throw new AppError(
                'User does not exists. Please, check your credentials',
            );
        }

        await this.userTokensRepository.generate(userExists.id);

        await this.mailProvider.sendMail(email, 'Deu tudo certo');
    }
}

export default SendForgotPasswordEmail;
