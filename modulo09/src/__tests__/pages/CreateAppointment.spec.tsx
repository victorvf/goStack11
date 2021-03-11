import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';

import { Alert } from 'react-native';
import CreateAppointment from '../../pages/CreateAppointment';
import api from '../../services/api';

const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
      goBack: mockedGoBack,
    }),
    useRoute: () => ({
      params: {
        provider_id: '1',
      },
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        id: '1',
        name: 'patricia',
        avatar_url: 'valid-url',
      },
    }),
  };
});

const apiMock = new MockAdapter(api);

describe('CreateAppointment page', () => {
  beforeEach(() => {
    apiMock.onGet('providers').reply(200, [
      {
        id: '1',
        name: 'provider-name',
        avatar_url: '',
      },
    ]);

    apiMock.onGet('/providers/1/day-availability').reply(200, [
      {
        day: 1,
        available: true,
      },
      {
        day: 2,
        available: true,
      },
      {
        day: 3,
        available: true,
      },
      {
        day: 4,
        available: true,
      },
      {
        day: 5,
        available: true,
      },
      {
        day: 6,
        available: true,
      },
      {
        day: 7,
        available: true,
      },
      {
        day: 8,
        available: true,
      },
      {
        day: 9,
        available: true,
      },
      {
        day: 10,
        available: true,
      },
      {
        day: 11,
        available: true,
      },
      {
        day: 12,
        available: true,
      },
      {
        day: 13,
        available: true,
      },
      {
        day: 14,
        available: true,
      },
      {
        day: 15,
        available: true,
      },
      {
        day: 16,
        available: true,
      },
      {
        day: 17,
        available: true,
      },
      {
        day: 18,
        available: true,
      },
      {
        day: 19,
        available: true,
      },
      {
        day: 20,
        available: true,
      },
      {
        day: 21,
        available: true,
      },
      {
        day: 22,
        available: true,
      },
      {
        day: 23,
        available: true,
      },
      {
        day: 24,
        available: true,
      },
      {
        day: 25,
        available: true,
      },
      {
        day: 26,
        available: true,
      },
      {
        day: 27,
        available: true,
      },
      {
        day: 28,
        available: true,
      },
      {
        day: 29,
        available: true,
      },
      {
        day: 30,
        available: true,
      },
      {
        day: 31,
        available: true,
      },
    ]);

    mockedGoBack.mockClear();
    mockedNavigate.mockClear();
  });

  it('should be able to list providers', async () => {
    const { getByText } = render(<CreateAppointment />);

    await waitFor(() => {
      expect(getByText('provider-name')).toBeTruthy();
    });
  });

  it('should be able to go back', async () => {
    const { getByTestId } = render(<CreateAppointment />);

    const backButton = getByTestId('back-button');

    act(() => {
      fireEvent.press(backButton);
    });

    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });

  it('should be able to select provider and show datePicker', async () => {
    const { getByTestId, getByText } = render(<CreateAppointment />);

    await waitFor(() => {
      expect(getByText('provider-name')).toBeTruthy();
    });

    const selectProvider = getByTestId('select-provider');
    const showDatePicker = getByText('Selecionar outra data');

    act(() => {
      fireEvent.press(selectProvider);
      fireEvent.press(showDatePicker);
    });
  });

  it('should be able to create an appointment', async () => {
    apiMock.onPost('/appointments').replyOnce(200);

    const { getByText } = render(<CreateAppointment />);

    const appointmentButton = getByText('Agendar');

    act(() => {
      fireEvent.press(appointmentButton);
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalled();
    });
  });

  it('should not be able to create an appointment', async () => {
    apiMock.onPost('/appointments').networkErrorOnce();

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(<CreateAppointment />);

    const appointmentButton = getByText('Agendar');

    act(() => {
      fireEvent.press(appointmentButton);
    });

    await waitFor(() => {
      expect(mockedNavigate).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
    });
  });
});
