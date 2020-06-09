import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

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

        const { token } = await this.userTokensRepository.generate(
            userExists.id,
        );

        await this.mailProvider.sendMail({
            to: {
                name: userExists.name,
                email: userExists.email,
            },
            subject: '[GoBarber] Recuperação de Senha',
            templateData: {
                template: 'Olá, {{ name }}: seu token -> {{ token }}',
                variables: {
                    name: userExists.name,
                    token,
                },
            },
        });
    }
}

export default SendForgotPasswordEmail;
