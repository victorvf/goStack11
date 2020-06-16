import AppError from '@shared/errors/AppError';

import FakeDiskStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeDiskStorageProvider: FakeDiskStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdataUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeDiskStorageProvider = new FakeDiskStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeDiskStorageProvider,
        );
    });

    it('should be able to update user avatar', async () => {
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
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-exists-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update users avatar but if exists an avatar with the same name exists, it will be deleted', async () => {
        const deleteFile = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

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
