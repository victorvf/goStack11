import styled from 'styled-components';

interface IssueProps {
  active: number;
}

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    color: #a8a8b3;

    display: flex;
    align-items: center;

    &:hover {
      color: #666;
    }

    svg {
      margin-right: 4px;
    }
  }
`;

export const RepositoryInfo = styled.section`
  margin-top: 80px;

  header {
    display: flex;
    align-items: center;

    img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
    }

    div {
      margin: 0 24px;
      flex: 1;

      strong {
        font-size: 34px;
        color: #3d3d4d;
      }

      p {
        font-size: 18px;
        color: #737380;
        margin-top: 4px;
      }
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin-top: 40px;

    li {
      strong {
        display: block;
        font-size: 36px;
        color: #3d3d4d;
      }

      span {
        display: block;
        margin-top: 4px;
        color: #6c6c80;
      }

      & + li {
        margin-left: 80px;
      }
    }
  }
`;

export const Issues = styled.div`
  margin-top: 20px;

  a {
    background: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 24px;
    text-decoration: none;

    display: flex;
    align-items: center;
    transition: transform 0.5s;

    &:hover {
      transform: translateX(10px);
    }

    & + a {
      margin-top: 16px;
    }

    div {
      margin: 0 16px;
      flex: 1;

      strong {
        font-size: 19px;
        color: #3d3d4d;
      }

      p {
        font-size: 16px;
        color: #a8a8b3;
        margin-top: 4px;
      }
    }

    svg {
      margin-left: auto;
    }
  }
`;

export const IssueFilter = styled.div<IssueProps>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 80px;

  button {
    color: #333;
    background: none;
    width: 150px;
    border: 0;
    padding-bottom: 10px;

    &:nth-child(${(props) => props.active + 1}) {
      color: #7159c1;
      border-bottom: 1px solid #7159c1;
    }
  }
`;

export const PageActions = styled.div`
  margin-top: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  button {
    padding: 8px;
    outline: 0;
    border: 0;
    background: #7159c1;
    color: #fff;
    border-radius: 4px;
    transition: opacity 0.25s ease-out;

    display: flex;
    align-items: center;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
