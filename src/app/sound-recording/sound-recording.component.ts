import { Component, OnInit } from '@angular/core';

import { SoundRecording } from '@interfaces';
import { ConfigService } from '@core/config.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sound-recording',
  templateUrl: './sound-recording.component.html',
  styleUrls: ['./sound-recording.component.scss']
})
export class SoundRecordingComponent implements OnInit {

  recordingsDB!: MatTableDataSource<SoundRecording>;
  columns = ['artist', 'title', 'isrc', 'duration'];

  constructor(private readonly configService: ConfigService) { }

  ngOnInit(): void {
    this.recordingsDB = new MatTableDataSource(this.configService.recordingsDB);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.recordingsDB.filter = filterValue.trim().toLowerCase();
  }
}
