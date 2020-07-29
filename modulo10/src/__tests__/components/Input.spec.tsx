import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { FiMail } from 'react-icons/fi';

import Input from '../../components/Input';

const mockedAddToast = jest.fn();
let mockedErrorUseField = '';

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'email',
      defaultValue: '',
      error: mockedErrorUseField,
      registerField: jest.fn(),
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus and lose focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #ff9000;');
      expect(inputContainerElement).toHaveStyle('color: #ff9000;');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #ff9000;');
      expect(inputContainerElement).not.toHaveStyle('color: #ff9000;');
    });
  });

  it('should keep input border highlight when input filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('color: #ff9000;');
    });
  });

  it('should be able to display an icon', () => {
    const { getByTestId } = render(
      <Input name="email" placeholder="E-mail" icon={FiMail} />,
    );

    const iconElement = getByTestId('input-icon');

    expect(iconElement).toBeTruthy();
  });

  it('should keep input border highlight when input errored', async () => {
    mockedErrorUseField = 'input-has-an-error';

    const { getByTestId } = render(<Input name="email" placeholder="E-mail" />);

    const inputContainerElement = getByTestId('input-container');

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #c53030;');
    });
  });
});
