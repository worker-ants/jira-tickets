import { ENV } from './env';
import { JiraClient } from './jira/api';
import { realpathSync } from 'fs';
import { ExcelWriter } from './lib/excel';

(async () => {
  try {
    const jiraClient = new JiraClient(ENV);
    let cursor = 0;
    const limit = ENV.CHUNK;
    const issues = [];

    const jql = `project = '${ENV.PROJECT_PREFIX}' 
      AND type != "Epic" 
      AND status IN ('To Do','검토','논의중','In Progress') 
      ORDER BY created DESC`;

    while (Infinity) {
      const chunk = await jiraClient.getIssues(jql, cursor, limit);
      if (chunk.issues.length) issues.push(...chunk.issues);

      cursor += limit;
      if (cursor >= chunk.total) break;
    }

    console.log(`${issues.length} 개의 이슈가 수집되었습니다.`);

    const resultPath = realpathSync('./result');
    const xlsxPath = `${resultPath}/${Date.now()}.xlsx`;

    const excelWriter = new ExcelWriter();
    const headers = ['id', 'key', 'assignee', 'status', 'summary', 'url'];
    excelWriter.jsonToSheet(issues, headers, {
      sheetName: '처리대상 이슈',
      colsStyle: [
        { hidden: true },
        { wch: 6 },
        { wch: 10 },
        { wch: 10 },
        { wch: 100 },
        { wch: 50 },
      ],
    });
    excelWriter.writeXlsx(xlsxPath);

    console.log(`${xlsxPath}에 수집된 이슈가 출력되었습니다.`);
  } catch (e) {
    console.error(e);
  }
})();
