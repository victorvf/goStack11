import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../components/Button';

describe('Button component', () => {
  it('should be able to render a button', () => {
    const { getByText } = render(<Button>Enviar</Button>);

    const buttonElement = getByText('Enviar');

    expect(buttonElement).toBeTruthy();
  });

  it('should be able to display loading when button is loading', () => {
    const { getByTestId } = render(<Button loading>Enviar</Button>);

    const buttonElement = getByTestId('button-component');

    expect(buttonElement).toHaveTextContent('Carregando ...');
  });
});
