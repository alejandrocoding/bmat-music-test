import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CSVParserService {

    private readonly SEPARATOR = ',';
    private readonly CHAR_TO_ESCAPE = '\"';
    private readonly NEW_ROW = '\n';

    static readonly DB_FILE_PATH = '/assets/files/sound_recordings.csv';
    static readonly INPUT_REPORT_PATH = '/assets/files/sound_recordings_input_report.csv';

    constructor(private readonly http: HttpClient) { }

    parseReport<T>(path: string) {
        return this.http.get(path, { observe: 'response', responseType: 'text' }).pipe(
            map(textResponse => {
                const csvAsString = textResponse.body as string;
                const csvAsStringArray = csvAsString.split(this.NEW_ROW).filter(row => !!row);
                const csvArray = [...csvAsStringArray];
                const headers = (csvArray.shift() as string).split(this.SEPARATOR);

                const rows = csvArray.map(row => {
                    let rowParsed = [];
                    if (row.startsWith(this.CHAR_TO_ESCAPE)) {
                        const [firstCell, restCells] = row.split(`${this.CHAR_TO_ESCAPE}${this.SEPARATOR}`);
                        const firstCellParsed = firstCell.replace(this.CHAR_TO_ESCAPE, '');
                        const restCellsParsed = restCells.split(this.SEPARATOR);
                        rowParsed.push(firstCellParsed, ...restCellsParsed);
                    } else {
                        rowParsed = row.split(this.SEPARATOR);
                    }
                    return rowParsed;
                });

                return rows.map((row) => {
                    const item: any = {};
                    row.forEach((propValue, index) => {
                        const propName = headers[index];
                        item[propName] = propValue;
                    });
                    return item as T;
                });
            })
        );
    }
}