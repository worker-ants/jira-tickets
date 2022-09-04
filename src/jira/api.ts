import axios from 'axios';
import { SearchResultInterface } from './api.interface';

export class JiraClient {
  private readonly ENV;
  private readonly client;

  constructor(env: Record<string, any>) {
    this.ENV = env;
    this.client = axios.create({
      baseURL: env.JIRA_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: env.JIRA_USER,
        password: env.JIRA_PASSWORD,
      },
      timeout: 5000,
    });
  }

  async getIssues(
    jql: string,
    startAt = 0,
    limit = 100,
  ): Promise<SearchResultInterface> {
    const params = {
      jql: jql,
      startAt: startAt,
      maxResults: limit,
      fields: ['summary', 'status', 'assignee'],
    };

    const { data } = await this.client.post('/rest/api/2/search', params);

    return {
      startAt: data.startAt,
      maxResults: data.maxResults,
      total: data.total,
      issues: data.issues.map((issue) => {
        return {
          id: parseInt(issue.id, 10),
          //url: issue.self,
          url: `${this.ENV.JIRA_URL}/browse/${issue.key}`,
          key: issue.key,
          summary: issue.fields.summary,
          assignee: issue.fields.assignee?.displayName || null,
          status: issue.fields.status.name,
        };
      }),
    };
  }
}
