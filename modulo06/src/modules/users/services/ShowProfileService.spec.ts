import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowUserProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        const userShowed = await showProfile.execute({ user_id: user.id });

        expect(userShowed).toMatchObject({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });
    });

    it('should not be able to show user when it does not exists', async () => {
        await expect(
            showProfile.execute({ user_id: 'non-exist-user' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
