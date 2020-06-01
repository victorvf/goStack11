import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new User', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
            name: 'Victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        expect(user).toMatchObject({
            name: 'Victor',
            email: 'vic@mail.com',
        });

        const matchPassword = await fakeHashProvider.compareHash(
            '123456',
            user.password,
        );

        expect(matchPassword).toBe(true);
    });

    it('should not be able to create two Users with the same email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        expect(
            createUser.execute({
                name: 'Victor',
                email: 'vic@mail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
