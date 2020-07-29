import { renderHook, act } from '@testing-library/react-hooks';

import { ToastProvider, useToast } from '../../hooks/toast';

describe('Toast hook', () => {
  it('should be able to add toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'info',
        title: 'test',
        description: 'test-description',
      });
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it('should be able to add toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'info',
        title: 'test',
        description: 'test-description',
      });
    });

    const { id } = result.current.messages[0];

    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.messages).toHaveLength(0);
  });
});
