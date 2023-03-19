import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})

export class HeroSearchComponent implements OnInit {
  
  // heroes$ est déclaré en tant qu'Observable:
  heroes$!: Observable<Hero[]>;

  private searchTerms = new Subject<string>(); 
  // Subject est à la fois une source de valeur d'Observabe et un Observable lui même. 
  //On peut souscrire à un Subject comme on le fait pour tout Observable.

  constructor(private heroService: HeroService) {}

  // Méthode pour pousser un mot recherché dans le stream d'Observables:
  search(term: string): void {
    this.searchTerms.next(term);
  }

  

  ngOnInit(): void {

    this.heroes$ = this.searchTerms.pipe(
      // opérateur pour attendre 300ms après chaque frappe avant de prendre en considération le mot
      debounceTime(300),

      // opérateur pour ignorer un nouveau mot si identique au précédent, s'assure qu'une requete est envoyée seulement si le filtre du texte a changé.
      distinctUntilChanged(),

      // opérateur pour switcher à un nouvel Observable recherché chaque fois que le mot change
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
    
  }

  // RAPPEL: le fichier .ts n'a pas besoin qu'on renseigne la souscription (.subscribe) à l'Observable heroes$, c'est déjà pris en compte avec AsyncPipe dans le .html
  
}