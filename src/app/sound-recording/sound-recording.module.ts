import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@core/material.module';
import { SoundRecordingComponent } from './sound-recording.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [SoundRecordingComponent],
})
export class SoundRecordingModule { }
