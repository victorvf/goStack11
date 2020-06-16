import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointment.execute({
            date: new Date(),
            user_id: '654321',
            provider_id: '123456',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
        expect(appointment.user_id).toBe('654321');
    });

    it('should not be able to create two appointment on the same date', async () => {
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
});
