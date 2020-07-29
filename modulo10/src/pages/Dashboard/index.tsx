import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useAuth } from '../../hooks/auth';

import DatePickerData from '../../utils/dayAndMonthsDayPicker';

import Header from '../../components/Header';

import api from '../../services/api';

import {
  Container,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const is_today = isToday(selectedDate);

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    async function loadMonthAvailability(): Promise<void> {
      const response = await api.get(
        `/providers/${user.id}/month-availability`,
        {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
          },
        },
      );

      setMonthAvailability(response.data);
    }

    loadMonthAvailability();
  }, [currentMonth, user]);

  useEffect(() => {
    async function loadAppointments(): Promise<void> {
      const response = await api.get('/providers/schedule', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      });

      const appointmentsFormatted = response.data.map(
        (appointment: Appointment) => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        },
      );

      setAppointments(appointmentsFormatted);
    }

    loadAppointments();
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "EEEE'-feira'", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header />

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {is_today && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {is_today && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>

              <div>
                <img
                  src={
                    nextAppointment.user.avatar_url ||
                    'https://api.adorable.io/avatars/100/Victor.png'
                  }
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 ? (
              <span>Você não possui agendamentos no turno da Manhã!</span>
            ) : (
              morningAppointments.map((appointment) => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={
                        appointment.user.avatar_url ||
                        'https://api.adorable.io/avatars/100/Victor.png'
                      }
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            )}
          </Section>
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 ? (
              <span>Você não possui agendamentos no turno da Tarde!</span>
            ) : (
              afternoonAppointments.map((appointment) => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={
                        appointment.user.avatar_url ||
                        'https://api.adorable.io/avatars/100/Victor.png'
                      }
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))
            )}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={DatePickerData.weekDay}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={DatePickerData.months}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
