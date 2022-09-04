export interface IssueInterface {
  id: number; // id
  url: string; // self
  key: string; // key
  summary: string; // fields.summary
  assignee: string; // fields.assignee?.displayName
  status: string; // fields.status.name
}

export interface SearchResultInterface {
  startAt: number; // startAt
  maxResults: number; // maxResults
  total: number; // total
  issues: IssueInterface[]; // issues
}
