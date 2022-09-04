import { ENV } from './env';
import { JiraClient } from './jira/api';

(async () => {
  try {
    const jiraClient = new JiraClient(ENV);
    let cursor = 0;
    const limit = ENV.CHUNK;
    const issues = [];

    while (Infinity) {
      const chunk = await jiraClient.getIssues(cursor, limit);
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
