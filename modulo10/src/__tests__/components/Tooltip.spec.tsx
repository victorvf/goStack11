import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from '../../components/Tooltip';

describe('Tooltip component', () => {
  it('should be able to render a tooltip', () => {
    const { getByText } = render(<Tooltip title="Test" />);

    const tooltipElement = getByText('Test');

    expect(tooltipElement).toBeTruthy();
  });
});
