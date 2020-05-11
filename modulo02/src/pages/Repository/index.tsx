import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import {
  Header,
  RepositoryInfo,
  Issues,
  IssueFilter,
  PageActions,
} from './styles';

import logo from '../../assets/log.svg';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Dashboard: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const repositoryName = params.repository;

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const filters = [
    { state: 'all', label: 'Todas' },
    { state: 'open', label: 'Abertas' },
    { state: 'closed', label: 'Fechadas' },
  ];
  const [filterIndex, setFilterIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function loadRepository(): Promise<void> {
      const response = await api.get(`/repos/${repositoryName}`);

      setRepository(response.data);
    }

    loadRepository();
  }, [params.repository, repositoryName]);

  useEffect(() => {
    async function loadIssues(): Promise<void> {
      const response = await api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: filters[filterIndex].state,
          per_page: 5,
          page,
        },
      });

      setIssues(response.data);
    }

    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterIndex, page]);

  function handleFilterClick(index: number): void {
    setFilterIndex(index);
    setPage(1);
  }

  return (
    <>
      <Header>
        <img src={logo} alt="Logo" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <IssueFilter active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilterClick(index)}
          >
            {filter.label}
          </button>
        ))}
      </IssueFilter>
      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} color="cbcbd6" />
          </a>
        ))}
      </Issues>
      <PageActions>
        <button
          type="button"
          disabled={page < 2}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>

        <span>Página: {page}</span>

        <button type="button" onClick={() => setPage(page + 1)}>
          Próxima
        </button>
      </PageActions>
    </>
  );
};

export default Dashboard;
