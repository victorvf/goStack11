import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
    mockedHistoryPush.mockClear();
  });

  it('should be able to recover the forgotten password', async () => {
    apiMock.onPost('/password/forgot').replyOnce(200);

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailElement = getByPlaceholderText('E-mail');
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(emailElement, { target: { value: 'johndoe@mail.com' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'E-mail de recuperação de senha',
        description:
          'Enviamos um e-mail para confirmar a recuperação de senha, check sua caixa de entrada',
      });
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to recover the forgotten password with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailElement = getByPlaceholderText('E-mail');
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(emailElement, { target: { value: 'not-valid-email' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to recover the forgotten password when api fails', async () => {
    apiMock.onPost('/password/forgot').networkErrorOnce();

    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const emailElement = getByPlaceholderText('E-mail');
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(emailElement, { target: { value: 'johndoe@mail.com' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description:
          'Ocorreu um erro ao tentar recuperar sua senha, tente novamente',
      });
    });
  });
});
