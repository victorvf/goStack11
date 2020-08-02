import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';

import { Alert } from 'react-native';
import SignIn from '../../pages/SignIn';

const mockedNavigate = jest.fn();
const mockedSignIn = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

describe('Sign In page', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
    mockedNavigate.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    fireEvent.changeText(emailElement, 'victor@mail.com');
    fireEvent.changeText(passwordElement, '123456');

    fireEvent.press(buttonSubmit);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalled();
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    fireEvent.changeText(emailElement, 'invalid-email');
    fireEvent.changeText(passwordElement, '123456');

    fireEvent.press(buttonSubmit);

    await waitFor(() => {
      expect(mockedSignIn).not.toHaveBeenCalled();
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  it('should not be able to sign in if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholder, getByText } = render(<SignIn />);

    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    fireEvent.changeText(emailElement, 'invalid-email');
    fireEvent.changeText(passwordElement, '123456');

    fireEvent.press(buttonSubmit);

    await waitFor(() => {
      expect(mockedSignIn).toThrowError();
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });
});
