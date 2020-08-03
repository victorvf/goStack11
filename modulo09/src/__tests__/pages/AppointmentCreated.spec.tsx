import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';

import AppointmentCreated from '../../pages/AppointmentCreated';

const mockedReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      reset: mockedReset,
    }),
    useRoute: () => ({
      params: {
        date: 1596481619985,
      },
    }),
  };
});

describe('AppointmentCreated page', () => {
  it('should be able to confirm the appointment', () => {
    const { getByText } = render(<AppointmentCreated />);

    const confirmButton = getByText('ok');

    act(() => {
      fireEvent.press(confirmButton);
    });

    waitFor(() => {
      expect(mockedReset).toHaveBeenCalled();
    });
  });
});
