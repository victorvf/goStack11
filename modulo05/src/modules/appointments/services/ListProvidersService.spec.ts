import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('should be able to list all providers, except user authenticated', async () => {
        const user = await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        await fakeUsersRepository.create({
            name: 'john ze',
            email: 'johnze@mail.com',
            password: '123456',
        });

        const allProviders = await listProviders.execute({ user_id: user.id });

        expect(allProviders).toHaveLength(2);
    });

    it('should be able to list all providers', async () => {
        await fakeUsersRepository.create({
            name: 'john doe',
            email: 'johndoe@mail.com',
            password: '123456',
        });

        await fakeUsersRepository.create({
            name: 'john ze',
            email: 'johnze@mail.com',
            password: '123456',
        });

        const allProviders = await listProviders.execute({});

        expect(allProviders).toHaveLength(2);
    });

    it('should not be able to list providers', async () => {
        const allProviders = await listProviders.execute({});

        expect(allProviders).toStrictEqual([]);
    });
});
