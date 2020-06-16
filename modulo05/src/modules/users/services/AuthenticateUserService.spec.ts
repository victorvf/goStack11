import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate User', async () => {
        const user = await createUser.execute({
            name: 'Victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        const response = await authenticateUser.execute({
            email: 'vic@mail.com',
            password: '123456',
        });

        expect(response.user).toEqual(user);
        expect(response).toHaveProperty('token');
    });

    it('should not be able to authenticate user when it does not exists', async () => {
        await expect(
            authenticateUser.execute({
                email: 'vic@mail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate user when password does not match', async () => {
        await createUser.execute({
            name: 'Victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'vic@mail.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
