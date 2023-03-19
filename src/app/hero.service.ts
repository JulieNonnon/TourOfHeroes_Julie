import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
// import de l'observable
import { Observable, of } from 'rxjs';
// import du service message
import { MessageService } from './message.service';
// import de HttpClient and HttpHeaders:
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import de la gestion d'erreur de RxJS, pour enrichir le resultat de l'observable avec la méthode pipe() method et lui donner un opérateur catchError().
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  //Constructeur avec un parametre qui déclare le service messageService en privé
  // SERVER: on injecte le HttpClient dans le constructeur, en privé avec la propriété http
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //NOTE SERVER: on continue d'injecter le service MessageService mais comme l'application l'appelle souvent, on l'englobe dans une méthode private log():
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  //NOTE SERVER: 
  private heroesUrl = 'api/heroes';  // URL vers l'API web

  // Créer méthode getHeroes() pour retourner le mock HEROES -> n'est plus utile après import de l'observable
  // getHeroes(): Hero[] { return HEROES; }



  // Avec l'import de l'observable (OBSOLETE QUAND ON APPELLE LE SERVER HTTP CI DESSOUS): 
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES);
  //   // envoi un message quand le héro est récupéré
  //   this.messageService.add('HeroService: fetched heroes')
  //   return heroes;
  // }


  // -> On remplace "of()" de l'ancienne méthode avec "http.get()" : l'app fonctionne toujours car les 2 méthodes retournent Observable<Hero[]>.


  // NOTE SERVER: avec l'appel du server http, utilisation de HttpClient
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl) // heroesURL c'est l'URL de l'API qu'on appelle plus haut
    .pipe(
      tap(_ => this.log('fetched heroes')), // l'opérateur tap() permet en regardant les valeurs de l'observable,fait quelquechose avec ces valeurs, et en les transmettant. Le callback tap() n'a pas acces à ces valeurs de lui même.
      catchError(this.handleError<Hero[]>('getHeroes', []))); // l'opérateur catchError() intercepte un observable qui rencontre une erreur -> la méthode handleError rapporte l'erreur et retourne un resultat inoffensif pour que l'app puisse continuer de fonctionner.
  }
    // -> Toutes les méthodes HttpClient retournent un Observable RxJS Observable de quelquechose.




  /**
   * GESTION DE L'ERREUR POUR QUE L'APP PUISSE FONCTIONNER
   * @param operation - nom de l'opération qui a échoué
   * @param result - valeur optionnelle à retourner en tant que résultat de l'observable
   */

  private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: envoyer l'erreur vers le journal d'infrastructure à distance
    console.error(error); // affichage erreur dans la console

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Laisser l'app fonctionner en retournant un resultat vide.
    return of(result as T);
    };
  }


  // NAVIGATION: ajout de l'id dans l'observable (OBSOLETE QUAND ON APPELLE LE SERVER HTTP CI DESSOUS)::
  // getHero(id: number): Observable<Hero> {
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }


  // SERVER: avec l'appel de HttpClient, présentera un 404 si id non trouvé
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }


  // *** NOTES: getHero() présente 3 différences majeures de getHeroes():

    // -> getHero() construit une requete URL avec l'id du héro souhaité
    // -> Le server devrait répondre avec un seul héro (au lieu d'un tableau d'héros)
    // -> getHero() retourne un Observable<Hero>, qui est un observable des objets Hero plutôt qu'un observable des tableaus Hero.



  // SERVER: methode updateHero() pour conserver les modifications, on utilise le http.put:
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  // *** NOTES: La méthode .put() prend en compte 3 paramètres:
    // -> L'URL
    // -> La donnée à mettre à jour (dans ce cas le héro modifié)
    // -> Les Options, httoOptions doit être renseigné comme ci-dessous:

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // SERVER: méthode addHero() pour ajouter un nouvel héro sur le serveur
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }


  //*** NOTES: addHero() présente 2 différences majeures de updateHero():

    // -> addHero() appelle HttpClient.post() au lieu de put()
    // -> addHero() attend du serveur qu'il créé un id pour le nouvel hero, qu'il retourne dans l'Observable<Hero>



  //SERVER: méthode pour supprimer un héro du server
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero')) 
    );
  }

  //*** NOTES: 
  // -> deleteHero() fait appelle à HttpClient.delete()
  // -> on n'envoie pas de données contrairement à put() et post()
  // -> on continue d'envoyer httpOptions


  // SEARCH: Méthode pour rechercher un héro renseigné dans le tableau
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // s'il n'existe pas, retourne un tableau vide d'héro.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

}


// getHeroes() et getHero() ont une signature asynchrone, ces 2 méthodes retournent le mock hero en tant qu'Observable (via la librairy RxJS)