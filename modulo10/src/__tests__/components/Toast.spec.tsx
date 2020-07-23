import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Toast from '../../components/ToastContainer/Toast';
import ToastContainer from '../../components/ToastContainer';

const mockedRemoveToast = jest.fn();

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      removeToast: mockedRemoveToast,
    }),
  };
});

describe('Toast component', () => {
  it('should be able to render Toast Compoent', () => {
    const { getByTestId } = render(
      <Toast message={{ id: '1', title: 'test toast' }} style={{}} />,
    );

    const toastElement = getByTestId('toast-item');

    expect(toastElement).toBeTruthy();
  });

  it('should be able to render ToastContainer component', () => {
    const { getByTestId } = render(
      <ToastContainer messages={[{ id: '1', title: 'test toast' }]} />,
    );

    const toastElement = getByTestId('toast-item');

    expect(toastElement).toBeTruthy();
  });

  it('should be able to render Toast Compoent with description and info colors', () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          title: 'test toast',
          description: 'test description',
        }}
        style={{}}
      />,
    );

    const toastElement = getByTestId('toast-item');

    expect(toastElement).toHaveTextContent('test toast');
    expect(toastElement).toHaveTextContent('test description');

    expect(toastElement).toHaveStyle('color: #3172b7;');
    expect(toastElement).toHaveStyle('background-color: #ebf8ff;');
  });

  it('should be able to render Toast Component with success colors', () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          type: 'success',
          title: 'test toast',
          description: 'test description',
        }}
        style={{}}
      />,
    );

    const toastElement = getByTestId('toast-item');

    expect(toastElement).toHaveStyle('color: #2e656a;');
    expect(toastElement).toHaveStyle('background-color: #e6fffa;');
  });

  it('should be able to render Toast Component with error colors', () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          type: 'error',
          title: 'test toast',
          description: 'test description',
        }}
        style={{}}
      />,
    );

    const toastElement = getByTestId('toast-item');

    expect(toastElement).toHaveStyle('color: #c53030;');
    expect(toastElement).toHaveStyle('background-color: #fddede;');
  });

  it('should be able to remove Toast Component when button is clicked', async () => {
    const { getByTestId } = render(
      <Toast
        message={{
          id: '1',
          type: 'error',
          title: 'test toast',
          description: 'test description',
        }}
        style={{}}
      />,
    );

    const buttonToastElement = getByTestId('toast-button');

    await wait(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith('1');
    });

    fireEvent.click(buttonToastElement);

    await wait(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith('1');
    });
  });

  it('should be able to remove Toast Component when it is rendered', async () => {
    render(
      <Toast
        message={{
          id: '1',
          type: 'error',
          title: 'test toast',
          description: 'test description',
        }}
        style={{}}
      />,
    );

    await wait(() => {
      expect(mockedRemoveToast).toHaveBeenCalledWith('1');
    });
  });
});
