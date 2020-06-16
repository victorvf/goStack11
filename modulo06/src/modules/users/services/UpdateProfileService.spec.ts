import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateUserProfile', () => {
    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider();
        fakeUsersRepository = new FakeUsersRepository();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'jhon@mail.com',
        });

        expect(updatedUser).toMatchObject({
            name: 'John Doe',
            email: 'jhon@mail.com',
        });
    });

    it('should not be able to update the profile when user does not exists', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'invalid',
                name: 'John Doe',
                email: 'jhon@mail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile when already exists an user with the same email', async () => {
        await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'teste',
            email: 'teste@mail.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'johndoe@mail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'jhon@mail.com',
            old_password: '123456',
            password: '654321',
        });

        expect(updatedUser).toMatchObject({
            name: 'John Doe',
            email: 'jhon@mail.com',
            password: '654321',
        });
    });

    it('should not be able to update the password without old_password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'jhon@mail.com',
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old_password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Doe',
                email: 'jhon@mail.com',
                old_password: 'wrong-old-password',
                password: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
