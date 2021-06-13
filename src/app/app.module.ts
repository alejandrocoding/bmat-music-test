import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigService } from '@core/config.service';

import { LayoutModule } from '@components/layout/layout.module';
import { MatcherModule } from './matcher/matcher.module';
import { SoundRecordingModule } from './sound-recording/sound-recording.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    MatcherModule,
    SoundRecordingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: dbFactory,
      deps: [ConfigService],
      multi: true
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function dbFactory(configService: ConfigService) {
  return () => configService.load.apply(configService);
}
