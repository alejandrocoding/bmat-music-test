import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatcherComponent } from './matcher/matcher.component';
import { SoundRecordingComponent } from './sound-recording/sound-recording.component';

const routes: Routes = [
    { path: 'matcher', component: MatcherComponent },
    { path: 'sound-recording', component: SoundRecordingComponent },
    { path: '', redirectTo: '/matcher', pathMatch: 'full' },
    { path: '**', redirectTo: '/matcher', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
