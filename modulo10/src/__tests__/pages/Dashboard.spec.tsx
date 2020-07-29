import React from 'react';
import { render, wait } from '@testing-library/react';
import AxiosMock from 'axios-mock-adapter';

import Dashboard from '../../pages/Dashboard';
import api from '../../services/api';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        id: '1',
        name: 'victor',
        email: 'victor@mail.com',
        avatar_url: 'valid-avatar',
      },
    }),
  };
});

const apiMock = new AxiosMock(api, { delayResponse: 200 });

describe('Dashboard page', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should be able to list the appointments', async () => {
    const { getByText } = render(<Dashboard />);

    apiMock.onGet('/providers/1/month-availability').reply(200, [
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

    apiMock.onGet('/providers/schedule').reply(200, [
      {
        id: '1',
        provider_id: '1',
        user_id: '12',
        date: '2020-07-28T14:00:00.000Z',
        user: {
          id: '1',
          name: 'victor doe',
          email: 'v@mail.com',
          avatar: null,
          created_at: '2020-06-18T14:30:35.303Z',
          updated_at: '2020-06-29T02:51:35.037Z',
          avatar_url: null,
        },
      },
      {
        id: '2',
        provider_id: '1',
        user_id: '13',
        date: '2020-07-28T17:00:00.000Z',
        user: {
          id: '1',
          name: 'praticia doe',
          email: 'v@mail.com',
          avatar: null,
          created_at: '2020-06-18T14:30:35.303Z',
          updated_at: '2020-06-29T02:51:35.037Z',
          avatar_url: null,
        },
      },
    ]);

    await wait(
      () => {
        expect(getByText('victor doe')).toBeTruthy();
        expect(getByText('praticia doe')).toBeTruthy();
      },
      { timeout: 2000 },
    );
  });

  it('should be able to list the appointments with disabled days', async () => {
    const { getByText } = render(<Dashboard />);

    apiMock.onGet('/providers/1/month-availability').reply(200, [
      {
        day: 1,
        available: false,
      },
      {
        day: 2,
        available: false,
      },
      {
        day: 3,
        available: false,
      },
      {
        day: 4,
        available: false,
      },
      {
        day: 5,
        available: false,
      },
      {
        day: 6,
        available: false,
      },
      {
        day: 7,
        available: false,
      },
      {
        day: 8,
        available: false,
      },
      {
        day: 9,
        available: false,
      },
      {
        day: 10,
        available: false,
      },
      {
        day: 11,
        available: false,
      },
      {
        day: 12,
        available: false,
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

    apiMock.onGet('/providers/schedule').reply(200, [
      {
        id: '1',
        provider_id: '1',
        user_id: '12',
        date: '2020-07-28T14:00:00.000Z',
        user: {
          id: '1',
          name: 'victor vitoria',
          email: 'v@mail.com',
          avatar: null,
          created_at: '2020-06-18T14:30:35.303Z',
          updated_at: '2020-06-29T02:51:35.037Z',
          avatar_url: null,
        },
      },
      {
        id: '2',
        provider_id: '1',
        user_id: '13',
        date: '2020-07-28T17:00:00.000Z',
        user: {
          id: '1',
          name: 'victor fontenele',
          email: 'v@mail.com',
          avatar: null,
          created_at: '2020-06-18T14:30:35.303Z',
          updated_at: '2020-06-29T02:51:35.037Z',
          avatar_url: null,
        },
      },
    ]);

    await wait(
      () => {
        expect(getByText('victor vitoria')).toBeTruthy();
        expect(getByText('victor fontenele')).toBeTruthy();
      },
      { timeout: 2000 },
    );
  });
});
