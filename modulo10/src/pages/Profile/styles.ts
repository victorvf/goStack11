import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;
    justify-content: center;

    div {
      width: 100%;
      max-width: 1129px;

      svg {
        color: #999591;
        width: 25px;
        height: 25px;
      }
    }
  }
`;

export const Content = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  margin: -165px auto 0;

  form {
    margin: 80px 0;
    width: 340px;

    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      align-self: flex-start;
    }
  }
`;

export const AvatarInput = styled.div`
  width: 186px;
  height: 186px;
  margin-bottom: 32px;
  position: relative;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    border: 0;
    background: #ff9000;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    input {
      display: none;
    }

    svg {
      color: #312e38;
      width: 22px;
      height: 22px;
    }
  }
`;
