import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
    it('should be able to recover the password using the Email', async () => {
        const fakeMailProvider = new FakeMailProvider();
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const fakeUsersRepository = new FakeUsersRepository();
        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
        );

        await fakeUsersRepository.create({
            name: 'victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'vic@mail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });
});
