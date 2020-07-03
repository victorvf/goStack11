import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.header`
  padding: 32px 0;
  background: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 21px;
      height: 21px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  > img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

export const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  line-height: 24px;

  span {
    color: #f4ede8;
  }

  a {
    color: #ff9000;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: ${darken(0.2, '#ff9000')};
    }
  }
`;
