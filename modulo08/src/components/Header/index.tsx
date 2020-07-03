import React from 'react';
import { FiPower } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import LogoGoBarber from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';

import { Container, HeaderContent, Profile, ProfileContent } from './styles';

const Header: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <Container>
      <HeaderContent>
        <img src={LogoGoBarber} alt="goBarber" />

        <Profile>
          <img
            src={
              user.avatar_url ||
              'https://api.adorable.io/avatars/100/Patricia.png'
            }
            alt={user.name}
          />

          <ProfileContent>
            <span>Bem vindo,</span>
            <Link to="/profile">{user.name}</Link>
          </ProfileContent>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>
      </HeaderContent>
    </Container>
  );
};

export default Header;
