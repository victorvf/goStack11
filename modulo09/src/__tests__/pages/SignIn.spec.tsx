import React from 'react';
import { render } from 'react-native-testing-library';

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
  it('should be able to render Sign In page', () => {
    const { getByPlaceholder } = render(<SignIn />);

    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    expect(emailElement).toBeTruthy();
    expect(passwordElement).toBeTruthy();
  });
});
