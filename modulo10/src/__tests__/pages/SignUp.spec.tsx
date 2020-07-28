import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../../pages/SignUp';
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

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to sign up', async () => {
    apiMock.onPost('/users').replyOnce(200);

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome completo');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonSubmit = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'victor' } });
    fireEvent.change(emailField, { target: { value: 'victor@mail.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('should not be able to sign up with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome completo');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonSubmit = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'victor' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, {
      target: { value: 'not-valid-password' },
    });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/');
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should not be able to sign up when api fails', async () => {
    apiMock.onPost('/users').networkErrorOnce();

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome completo');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonSubmit = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'victor' } });
    fireEvent.change(emailField, { target: { value: 'victor@mail.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro na Criação',
        description: 'Ocorreu um erro ao fazer cadastro, cheque as credenciais',
      });
    });
  });
});
