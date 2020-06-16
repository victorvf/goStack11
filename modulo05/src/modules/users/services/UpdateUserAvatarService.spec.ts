import AppError from '@shared/errors/AppError';

import FakeDiskStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdataUserAvatar', () => {
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeDiskStorageProvider = new FakeDiskStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeDiskStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: 'victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update the users avatar when the user does not exist', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeDiskStorageProvider = new FakeDiskStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeDiskStorageProvider,
        );

        expect(
            updateUserAvatar.execute({
                user_id: 'non-exists-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update users avatar but if exists an avatar with the same name exists, it will be deleted', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeDiskStorageProvider = new FakeDiskStorageProvider();

        const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeDiskStorageProvider,
        );

        const user = await fakeUsersRepository.create({
            name: 'victor',
            email: 'vic@mail.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
