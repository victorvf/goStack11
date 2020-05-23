import React from 'react';
import { Image } from 'react-native';

import logoGoBarber from '../../assets/logo.png';

import { Container, Title } from './styles';

const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={logoGoBarber} />
      <Title>Faça seu Login</Title>
    </Container>
  );
};

export default SignIn;
