// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the availability of the month from provider', async () => {
        for (let hr = 8; hr < 18; hr += 1) {
            fakeAppointmentsRepository.create({
                date: new Date(2020, 5, 19, hr, 0, 0),
                user_id: '654321',
                provider_id: '2132131',
            });
        }

        await fakeAppointmentsRepository.create({
            date: new Date(2020, 5, 20, 11, 0, 0),
            user_id: '654321',
            provider_id: '2132131',
        });

        const availabilityMonth = await listProviderMonthAvailability.execute({
            provider_id: '2132131',
            month: 6,
            year: 2020,
        });

        expect(availabilityMonth).toEqual(
            expect.arrayContaining([
                { day: 19, available: false },
                { day: 20, available: true },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
