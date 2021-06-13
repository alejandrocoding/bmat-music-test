import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { startWith, map, tap, takeUntil } from 'rxjs/operators';

import { SoundRecording } from '@interfaces';
import { ConfigService } from '@core/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-matcher',
  templateUrl: './matcher.component.html',
  styleUrls: ['./matcher.component.scss']
})
export class MatcherComponent implements OnInit, OnDestroy {

  recordings: SoundRecording[] = [];
  recordingsDB: SoundRecording[] = [];
  filteredList: SoundRecording[][] = [];

  form!: FormGroup;
  columns = ['artist', 'title', 'isrc', 'duration', 'match_to'];


  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly configService: ConfigService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.recordings = this.configService.recordingsInput;
    this.recordingsDB = this.configService.recordingsInput;
    this.addFormControlsPerMatchImported(this.recordings);

    this.filteredList = this.runAutoMatcher(this.recordings, this.recordingsDB);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      records: this.fb.array([])
    });
  }

  private addFormControlsPerMatchImported(recordings: SoundRecording[]) {
    recordings.forEach(() => {
      this.records.push(this.fb.control('', Validators.required));
      this.filteredList.push([]);
    });

    this.records.controls.forEach((ctrl, i) => ctrl.valueChanges.pipe(
      startWith(''),
      map(text => text ? this.filterDBRecords(text) : this.recordingsDB.slice()),
      tap(value => this.filteredList[i] = value),
      takeUntil(this.destroy$)
    ).subscribe());
  }

  private runAutoMatcher(recordsInput: SoundRecording[], recordsDB: SoundRecording[]) {
    const matches: SoundRecording[][] = [];
    recordsInput.forEach((record, rowIndex) => {
      matches.push([]);
      recordsDB.forEach(recordDB => {
        if (record.isrc === recordDB.isrc) {
          matches[rowIndex].push(recordDB);
        }
        else if (record.artist === recordDB.artist && record.title.search(recordDB.title) > -1) {
          matches[rowIndex].push(recordDB);
        }
      });
    });
    return matches;
  }

  private filterDBRecords(filter: string | SoundRecording) {
    if (typeof filter === 'string') {
      return this.recordings.filter(record =>
        record.title.toLowerCase().indexOf(filter.toLowerCase()) === 0 ||
        record.artist.toLowerCase().indexOf(filter.toLowerCase()) === 0 ||
        record.isrc.toLowerCase().indexOf(filter.toLowerCase()) === 0);
    }
    return this.recordings.filter(record =>
      record.title.toLowerCase().indexOf(filter.title.toLowerCase()) === 0 ||
      record.artist.toLowerCase().indexOf(filter.artist.toLowerCase()) === 0 ||
      record.isrc.toLowerCase().indexOf(filter.isrc.toLowerCase()) === 0);
  }

  private removeSoundRecording(index: number) {
    this.recordings.splice(index, 1);   // Remove from component state array
    this.recordings = [...this.recordings];
    this.filteredList.splice(index, 1); // Remove filter associated
    this.records.removeAt(index);       // Remove Form Control from Form Array
  }

  get records() {
    return this.form.controls.records as FormArray;
  }

  displayOpt(record: SoundRecording) {
    return record.title;
  }

  save(recording: SoundRecording, index: number) {
    this.snackBar.open(`Sound Recording: ${recording.title} by ${recording.artist} saved in DB successfully`, '', { duration: 5000 });
    this.removeSoundRecording(index);
  }

  add(recording: SoundRecording, index: number) {
    this.snackBar.open(`New Sound Recording: ${recording.title} by ${recording.artist}`, '', { duration: 5000 });
    this.removeSoundRecording(index);
  }

  removeAutoMatch(index: number) {
    this.filteredList[index] = [...this.recordingsDB];
    this.records.controls[index].markAsDirty();
  }

}
