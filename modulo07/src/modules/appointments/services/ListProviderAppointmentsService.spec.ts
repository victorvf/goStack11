// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the appointments on a specific day', async () => {
        // Month in Javascript Date is month-1 : 6(june) - 1 = 5
        const appointment1 = await fakeAppointmentsRepository.create({
            date: new Date(2020, 5, 20, 14, 0, 0),
            user_id: '654321',
            provider_id: '2132131',
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            date: new Date(2020, 5, 20, 15, 0, 0),
            user_id: '654321',
            provider_id: '2132131',
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: '2132131',
            day: 20,
            month: 6,
            year: 2020,
        });

        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
