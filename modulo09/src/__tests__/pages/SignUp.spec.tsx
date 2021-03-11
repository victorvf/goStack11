import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';

import { Alert } from 'react-native';
import SignUp from '../../pages/SignUp';
import api from '../../services/api';

const mockedGoBack = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockedGoBack,
    }),
  };
});

describe('SignUp page', () => {
  beforeEach(() => {
    mockedGoBack.mockClear();
  });

  it('should be able to sign up', async () => {
    apiMock.onPost('/users').replyOnce(200, {
      id: '1',
      name: 'victor',
      email: 'victor@mail.com',
      avatar_url: 'valid-avatar',
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholder, getByText } = render(<SignUp />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    act(() => {
      fireEvent.changeText(nameElement, 'Victor');
      fireEvent.changeText(emailElement, 'victor@mail.com');
      fireEvent.changeText(passwordElement, '123456');

      fireEvent.press(buttonSubmit);
    });

    waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });

  it('should not be able to sign up with invalid credentials', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholder, getByText } = render(<SignUp />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    act(() => {
      fireEvent.changeText(nameElement, 'Victor');
      fireEvent.changeText(emailElement, 'invalid-email');
      fireEvent.changeText(passwordElement, '1234');

      fireEvent.press(buttonSubmit);
    });

    waitFor(() => {
      expect(mockedGoBack).not.toHaveBeenCalled();
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });

  it('should not be able to return for sign in', async () => {
    const { getByTestId } = render(<SignUp />);

    const buttonBack = getByTestId('back-button');

    fireEvent.press(buttonBack);

    waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });

  it('should not be able to sign up if api fails', async () => {
    apiMock.onPost('/users').networkErrorOnce();

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholder, getByText } = render(<SignUp />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha');

    const buttonSubmit = getByText('Entrar');

    act(() => {
      fireEvent.changeText(nameElement, 'Victor');
      fireEvent.changeText(emailElement, 'victor@mail.com');
      fireEvent.changeText(passwordElement, '123456');

      fireEvent.press(buttonSubmit);
    });

    waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao criar conta',
        'Aconteceu um erro ao tentar criar sua conta, verifique as credenciais',
      );
    });
  });
});
