import xlsx, { ColInfo } from 'xlsx';

interface IOptions {
  sheetName: string;
  colsStyle?: ColInfo[];
}

export class ExcelWriter {
  private readonly book;

  constructor() {
    this.book = xlsx.utils.book_new();
  }

  public jsonToSheet(
    data: Record<string, string | number>[],
    headers: string[],
    options?: IOptions,
  ) {
    const sheet = xlsx.utils.json_to_sheet(data, {
      header: headers,
      skipHeader: true,
    });

    if (options?.colsStyle) sheet['!cols'] = options?.colsStyle;

    xlsx.utils.book_append_sheet(
      this.book,
      sheet,
      options?.sheetName ?? 'Sheet',
    );
  }

  public writeXlsx(fileName: string) {
    xlsx.writeFile(this.book, fileName);
  }
}
