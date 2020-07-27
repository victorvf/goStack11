import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import Profile from '../../pages/Profile';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
const mockedUpdateUser = jest.fn();

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

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        name: 'victor v',
        email: 'victorv@mail.com',
        avatar_url: 'valid-avatar',
      },
      updateUser: mockedUpdateUser,
    }),
  };
});

describe('Profile page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
    mockedHistoryPush.mockClear();
    mockedUpdateUser.mockClear();
  });

  it('should be able to update user profile', async () => {
    apiMock.onPut('/profile').replyOnce(200, {
      id: '1',
      name: 'victor',
      email: 'victor@mail.com',
      avatar_url: 'valid-avatar',
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameInput = getByPlaceholderText('Nome completo');
    const emailInput = getByPlaceholderText('E-mail');
    const oldPasswordInput = getByPlaceholderText('Senha atual');
    const passwordInput = getByPlaceholderText('Nova senha');
    const newPasswordInput = getByPlaceholderText('Confirmar senha');
    const buttonSubmit = getByText('Confirmar mudanças');

    fireEvent.change(nameInput, { target: { value: 'victor' } });
    fireEvent.change(emailInput, { target: { value: 'victor@mail.com' } });
    fireEvent.change(oldPasswordInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, { target: { value: '1234567' } });
    fireEvent.change(newPasswordInput, { target: { value: '1234567' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalled();
    });
  });

  it('should not be able to update user profile with not valid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameInput = getByPlaceholderText('Nome completo');
    const emailInput = getByPlaceholderText('E-mail');
    const oldPasswordInput = getByPlaceholderText('Senha atual');
    const passwordInput = getByPlaceholderText('Nova senha');
    const newPasswordInput = getByPlaceholderText('Confirmar senha');
    const buttonSubmit = getByText('Confirmar mudanças');

    fireEvent.change(nameInput, { target: { value: 'victor' } });
    fireEvent.change(emailInput, { target: { value: 'not-valid-email' } });
    fireEvent.change(oldPasswordInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, {
      target: { value: 'not-valid-password' },
    });
    fireEvent.change(newPasswordInput, { target: { value: '1234567' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should not be able to update user profile when api fails', async () => {
    apiMock.onPut('/profile').networkErrorOnce();

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameInput = getByPlaceholderText('Nome completo');
    const emailInput = getByPlaceholderText('E-mail');
    const oldPasswordInput = getByPlaceholderText('Senha atual');
    const passwordInput = getByPlaceholderText('Nova senha');
    const newPasswordInput = getByPlaceholderText('Confirmar senha');
    const buttonSubmit = getByText('Confirmar mudanças');

    fireEvent.change(nameInput, { target: { value: 'victor' } });
    fireEvent.change(emailInput, { target: { value: 'victor@mail.com' } });
    fireEvent.change(oldPasswordInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, { target: { value: '1234567' } });
    fireEvent.change(newPasswordInput, { target: { value: '1234567' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Ocorreu um erro ao atualizar perfil, tente novamente',
      });
    });
  });

  it('should be able to update user avatar', async () => {
    apiMock.onPatch('/users/avatar').replyOnce(200, {
      id: '1',
      name: 'victor',
      email: 'victor@mail.com',
      avatar: 'valid-avatar',
    });

    const { getByTestId } = render(<Profile />);

    const avatarInput = getByTestId('avatar-profile');

    fireEvent.change(avatarInput, {
      target: { files: ['valid-input', 'valid-input'] },
    });

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Avatar Atualizado!',
        description: 'Avatar atualizado com sucesso, agora só ser feliz!',
      });
    });
  });

  it('should not be able to update user avatar without file', async () => {
    const { getByTestId } = render(<Profile />);

    const avatarInput = getByTestId('avatar-profile');

    fireEvent.change(avatarInput, {
      target: {},
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro na Atualização do Avatar',
        description:
          'Ocorreu um erro ao tentar atualizar o avatar, tente novamente',
      });
    });
  });

  it('should not be able to update user avatar when api fails', async () => {
    apiMock.onPatch('/users/avatar').networkErrorOnce();

    const { getByTestId } = render(<Profile />);

    const avatarInput = getByTestId('avatar-profile');

    fireEvent.change(avatarInput, {
      target: { files: ['valid-input', 'valid-input'] },
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith({
        type: 'error',
        title: 'Erro na Atualização do Avatar',
        description:
          'Ocorreu um erro ao tentar atualizar o avatar, tente novamente',
      });
    });
  });
});
