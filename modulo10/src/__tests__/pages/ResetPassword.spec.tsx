import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
let mockedSearchLocation = '?token=valid-token';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => {
      return {
        search: mockedSearchLocation,
      };
    },
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Reset Password page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to reset password', async () => {
    apiMock.onPost('/password/reset').replyOnce(200);

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordElement = getByPlaceholderText('Nova senha');
    const passwordConfirmationElement = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(passwordElement, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationElement, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset password with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordElement = getByPlaceholderText('Nova senha');
    const passwordConfirmationElement = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(passwordElement, {
      target: { value: 'not-valid-password' },
    });
    fireEvent.change(passwordConfirmationElement, {
      target: { value: '12345' },
    });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to reset password without token', async () => {
    mockedSearchLocation = '?token=';

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordElement = getByPlaceholderText('Nova senha');
    const passwordConfirmationElement = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonSubmit = getByText('Enviar');

    fireEvent.change(passwordElement, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationElement, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
      });
    });
  });
});
