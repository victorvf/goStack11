import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new User', async () => {
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
        await createUser.execute({
            name: 'Victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        await expect(
            createUser.execute({
                name: 'Victor',
                email: 'vic@mail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
