import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                day,
                month,
                year,
            },
        );

        const hourStart = 8;

        // array where starts with { hourStart } = [8, 9 , 10, 11, ...];
        const eachHourArray = Array.from(
            { length: 10 },
            (value, index) => index + hourStart,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map((hour) => {
            const hasAppointmentInHour = appointments.find(
                (appointment) => getHours(appointment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available:
                    !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}
