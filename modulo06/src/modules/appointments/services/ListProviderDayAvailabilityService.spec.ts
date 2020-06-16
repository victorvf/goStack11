// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the availability of the day from provider', async () => {
        await fakeAppointmentsRepository.create({
            date: new Date(2020, 5, 20, 14, 0, 0),
            user_id: '654321',
            provider_id: '2132131',
        });

        await fakeAppointmentsRepository.create({
            date: new Date(2020, 5, 20, 15, 0, 0),
            user_id: '654321',
            provider_id: '2132131',
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 5, 20, 11).getTime();
        });

        const availabilityMonth = await listProviderDayAvailability.execute({
            provider_id: '2132131',
            day: 20,
            month: 6,
            year: 2020,
        });

        expect(availabilityMonth).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 11, available: false },
                { hour: 12, available: true },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
            ]),
        );
    });
});
