import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';

import Dashboard from '../../pages/Dashboard';
import api from '../../services/api';

const mockedNavigate = jest.fn();

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

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

const apiMock = new MockAdapter(api);

describe('Dashboard page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to load providers', async () => {
    apiMock.onGet('providers').replyOnce(200, [
      {
        id: '1',
        name: 'victor',
        avatar_url: 'valid-url',
      },
    ]);

    const { getByText } = render(<Dashboard />);

    await waitFor(() => {
      expect(getByText('victor')).toBeTruthy();
    });
  });

  it('should be able to navigate to the profile', async () => {
    apiMock.onGet('providers').replyOnce(200, [
      {
        id: '1',
        name: 'victor',
        avatar_url: '',
      },
    ]);

    const { getByTestId } = render(<Dashboard />);

    const profileButton = getByTestId('profile-button');

    act(() => {
      fireEvent.press(profileButton);
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalled();
    });
  });

  it('should be able to navigate to createAppointment', async () => {
    apiMock.onGet('providers').replyOnce(200, [
      {
        id: '1',
        name: 'victor',
        avatar_url: 'valid-url',
      },
    ]);

    const { getByText, getByTestId } = render(<Dashboard />);

    await waitFor(() => {
      expect(getByText('victor')).toBeTruthy();
    });

    const providerButton = getByTestId('provider-button');

    act(() => {
      fireEvent.press(providerButton);
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalled();
    });
  });
});
