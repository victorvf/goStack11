import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    date: Date;
    user_id: string;
    provider_id: string;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        date,
        user_id,
        provider_id,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const currentDate = new Date(Date.now());

        if (isBefore(appointmentDate, currentDate)) {
            throw new AppError(
                'you cannot create an appointment on a past date',
            );
        }

        if (user_id === provider_id) {
            throw new AppError(
                'you cannot create an appointment with yourself',
            );
        }

        const checkHour = getHours(appointmentDate);

        if (checkHour < 8 || checkHour > 17) {
            throw new AppError(
                'you cannot create an appointment before 8am and after 5pm',
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('this appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
