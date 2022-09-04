import * as dotenv from 'dotenv';
dotenv.config();

const chunk = parseInt(process.env.CHUNK ?? '100', 10);
export const ENV = {
  JIRA_URL: process.env.JIRA_URL.replace(/\/+$/, ''),
  JIRA_USER: process.env.JIRA_USER,
  JIRA_PASSWORD: process.env.JIRA_PASSWORD,
  CHUNK: chunk > 0 ? chunk : 100,
};
