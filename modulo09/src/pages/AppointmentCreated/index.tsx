import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Container, Title, Description, Button, ButtonText } from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handleConfirmation = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const dateFormatted = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE'-feira, dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      { locale: ptBR },
    );
  }, [routeParams]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{dateFormatted}</Description>

      <Button onPress={handleConfirmation}>
        <ButtonText>ok</ButtonText>
      </Button>
    </Container>
  );
};

export default AppointmentCreated;
