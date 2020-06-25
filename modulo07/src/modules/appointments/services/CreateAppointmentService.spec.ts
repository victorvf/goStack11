import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 19, 10).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 5, 19, 11),
            user_id: '654321',
            provider_id: '123456',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
        expect(appointment.user_id).toBe('654321');
    });

    it('should not be able to create two appointments on the same date', async () => {
        const currentDate = new Date(2020, 6, 10, 11);

        await createAppointment.execute({
            date: currentDate,
            user_id: '654321',
            provider_id: '123456',
        });

        await expect(
            createAppointment.execute({
                date: currentDate,
                user_id: '654321',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 19, 10).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 5, 19, 9),
                user_id: '654321',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with the same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 19, 10).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 5, 19, 11),
                user_id: '654321',
                provider_id: '654321',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 19, 8).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 5, 20, 7),
                user_id: '654321',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 5, 19, 18),
                user_id: '654321',
                provider_id: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
