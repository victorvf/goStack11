import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Header from '../../components/Header';

const mockedSignOut = jest.fn();
const mockedUser = jest.fn(() => ({
  name: 'victor',
  avatar_url: 'https://api.adorable.io/avatars/100/Patricia.png',
}));

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: mockedUser,
      signOut: mockedSignOut,
    }),
  };
});

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('Header component', () => {
  it('should be able to render Header Component', () => {
    const { getByTestId } = render(<Header />);

    const headerElement = getByTestId('header-container');

    expect(headerElement).toBeTruthy();
  });

  it('should be able to render Header Component without user avatar_url', () => {
    mockedUser.mockImplementation(() => ({
      name: 'victor',
      avatar_url: '',
    }));

    const { getByTestId } = render(<Header />);

    const headerElement = getByTestId('header-container');

    expect(headerElement).toBeTruthy();
  });

  it('should be able to Sign Out user', () => {
    const { getByTestId } = render(<Header />);

    const buttonElement = getByTestId('header-button');

    fireEvent.click(buttonElement);

    expect(mockedSignOut).toHaveBeenCalled();
  });
});
