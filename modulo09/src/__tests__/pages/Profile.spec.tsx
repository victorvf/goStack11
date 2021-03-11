import React from 'react';
import { render, fireEvent, waitFor, act } from 'react-native-testing-library';
import MockAdapter from 'axios-mock-adapter';

import api from '../../services/api';

import Profile from '../../pages/Profile';

const mockedUpdateUser = jest.fn();
const mockedGoBack = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        id: '1',
        name: 'victor',
        email: 'victor@mail.com',
        avatar_url: 'valid-avatar',
      },
      updateUser: mockedUpdateUser,
    }),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockedGoBack,
    }),
  };
});

jest.mock('react-native-image-picker', () => {
  return {
    showImagePicker: jest.fn(),
  };
});

describe('Profile page', () => {
  beforeEach(() => {
    mockedGoBack.mockClear();
    mockedUpdateUser.mockClear();
  });

  it('should be able to update user profile with only name and email', async () => {
    apiMock.onPut('/profile').replyOnce(200, {
      id: '1',
      name: 'victor v',
      email: 'victor@mail.com',
      avatar_url: 'valid-avatar',
    });

    const { getByPlaceholder, getByText } = render(<Profile />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');

    const buttonSubmit = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.changeText(nameElement, 'victor v');
      fireEvent.changeText(emailElement, 'victor@mail.com');

      fireEvent.press(buttonSubmit);
    });

    await waitFor(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });

  it('should not be able to update user profile whitout new password', async () => {
    const { getByPlaceholder, getByText } = render(<Profile />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const passwordElement = getByPlaceholder('Senha atual');

    const buttonSubmit = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.changeText(nameElement, 'victor v');
      fireEvent.changeText(emailElement, 'victor@mail.com');
      fireEvent.changeText(passwordElement, '123456');

      fireEvent.press(buttonSubmit);
    });

    await waitFor(() => {
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedGoBack).not.toHaveBeenCalled();
    });
  });

  it('should be able to update user profile with all credentials', async () => {
    apiMock.onPut('/profile').replyOnce(200, {
      id: '1',
      name: 'victor v',
      email: 'victor@mail.com',
      avatar_url: 'valid-avatar',
    });

    const { getByPlaceholder, getByText } = render(<Profile />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const oldPasswordElement = getByPlaceholder('Senha atual');
    const newPasswordElement = getByPlaceholder('Nova senha');
    const confirmPasswordElement = getByPlaceholder('Confirmar senha');

    const buttonSubmit = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.changeText(nameElement, 'victor v');
      fireEvent.changeText(emailElement, 'victor@mail.com');
      fireEvent.changeText(oldPasswordElement, '123456');
      fireEvent.changeText(newPasswordElement, '1234567');
      fireEvent.changeText(confirmPasswordElement, '1234567');

      fireEvent.press(buttonSubmit);
    });

    await waitFor(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedGoBack).toHaveBeenCalled();
    });
  });

  it('should not be able to update user profile when newPassword and confirmPassword does not match', async () => {
    const { getByPlaceholder, getByText } = render(<Profile />);

    const nameElement = getByPlaceholder('Nome completo');
    const emailElement = getByPlaceholder('E-mail');
    const oldPasswordElement = getByPlaceholder('Senha atual');
    const newPasswordElement = getByPlaceholder('Nova senha');
    const confirmPasswordElement = getByPlaceholder('Confirmar senha');

    const buttonSubmit = getByText('Confirmar mudanças');

    act(() => {
      fireEvent.changeText(nameElement, 'victor v');
      fireEvent.changeText(emailElement, 'victor@mail.com');
      fireEvent.changeText(oldPasswordElement, '123456');
      fireEvent.changeText(newPasswordElement, '1234567');
      fireEvent.changeText(confirmPasswordElement, '12345678');

      fireEvent.press(buttonSubmit);
    });

    await waitFor(() => {
      expect(mockedUpdateUser).not.toHaveBeenCalled();
      expect(mockedGoBack).not.toHaveBeenCalled();
    });
  });
});
