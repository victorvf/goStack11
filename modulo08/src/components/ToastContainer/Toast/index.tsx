import React, { useCallback, useEffect } from 'react';
import { FiFrown, FiInfo, FiThumbsUp, FiX } from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={20} />,
  error: <FiFrown size={20} />,
  success: <FiThumbsUp size={20} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  const handleRemove = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast],
  );

  return (
    <Container type={message.type} style={style}>
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => handleRemove(message.id)}>
        <FiX size={17} />
      </button>
    </Container>
  );
};

export default Toast;
