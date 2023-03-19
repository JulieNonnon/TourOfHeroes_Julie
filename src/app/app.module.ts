import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HttpClientModule } from '@angular/common/http'; // HttpClient permet de communiquer avec un remote server (serveur à distance), permet aussi de conserver des modifications quand un héro est modifié
// penser à installer le package "In-memory Web API" avec npm install angular-in-memory-web-api --save

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'; //module permettant d'intercepter les requetes HTTP et retourne des simulations de réponses du serveur (le virer une fois un vrai serveur mis en place)

import { InMemoryDataService } from './in-memory-data.service';
import { HeroSearchComponent } from './hero-search/hero-search.component'; //penser à créer le service concerné avec "ng generate service InMemoryData"


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
