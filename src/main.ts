import { ENV } from './env';
import axios from 'axios';

const client = axios.create({
  baseURL: ENV.JIRA_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: ENV.JIRA_USER,
    password: ENV.JIRA_PASSWORD,
  },
  timeout: 5000,
});

interface IssueInterface {
  id: number; // id
  url: string; // self
  key: string; // key
  summary: string; // fields.summary
  assignee: string; // fields.assignee?.displayName
  status: string; // fields.status.name
}
interface SearchResultInterface {
  startAt: number; // startAt
  maxResults: number; // maxResults
  total: number; // total
  issues: IssueInterface[]; // issues
}

async function getIssues(
  startAt = 0,
  limit = 100,
): Promise<SearchResultInterface> {
  const params = {
    jql: `project = 'CV' 
      AND type != "Epic" 
      AND status IN ('To Do','검토','논의중','In Progress') 
      ORDER BY created DESC`,
    startAt: startAt,
    maxResults: limit,
    fields: ['summary', 'status', 'assignee'],
  };

  const { data } = await client.post('/rest/api/2/search', params);

  return {
    startAt: data.startAt,
    maxResults: data.maxResults,
    total: data.total,
    issues: data.issues.map((issue) => {
      return {
        id: parseInt(issue.id, 10),
        //url: issue.self,
        url: `${ENV.JIRA_URL}/browse/${issue.key}`,
        key: issue.key,
        summary: issue.fields.summary,
        assignee: issue.fields.assignee?.displayName || null,
        status: issue.fields.status.name,
      };
    }),
  };
}

(async () => {
  try {
    let cursor = 0;
    const limit = ENV.CHUNK;
    const issues = [];

    while (Infinity) {
      const chunk = await getIssues(cursor, limit);
      if (chunk.issues.length) issues.push(...chunk.issues);

      cursor += limit;
      if (cursor >= chunk.total) break;
    }

    console.log(issues);
    console.log(`${issues.length} 개의 이슈가 수집되었습니다.`);
  } catch (e) {
    console.error(e);
  }
})();
