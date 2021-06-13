import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { SoundRecording } from '@interfaces';
import { CSVParserService } from '@services';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    recordingsInput: SoundRecording[] = [];
    recordingsDB: SoundRecording[] = [];

    constructor(private injector: Injector) { }

    load() {
        const csvParserService = this.injector.get(CSVParserService);
        return new Promise(async (resolve, reject) => {
            try {
                this.recordingsInput = await csvParserService.parseReport<SoundRecording>(CSVParserService.INPUT_REPORT_PATH).toPromise();
                this.recordingsDB = await csvParserService.parseReport<SoundRecording>(CSVParserService.DB_FILE_PATH).toPromise();
                resolve(this.recordingsDB);
            } catch {
                console.error('DB FILE OR INPUT REPORT FILE CAN NOT BE LOADED, PLEASE TRY AGAIN');
                reject()
            }
        });
    }
}