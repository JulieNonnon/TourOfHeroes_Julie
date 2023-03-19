import { Component, OnInit } from '@angular/core';
// import de l'interface Hero ("hero.ts")
import { Hero } from '../hero';
// import du service ("hero.service.ts")
import { HeroService } from '../hero.service';
// import du service ("message.service.ts")
import { MessageService } from '../message.service';


// import du mock HEROES ("mock-heroes.ts") --> n'est plus nécessaire avec l'import du service hero.service (inclu)
// import { HEROES } from '../mock-heroes';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {

// propriété hero de type Hero (peut être mis en commentaire)
// hero : Hero = {id: 1, name: "Windstorm"};


// propriété heroes pour l'affichage d'un tableau du mock HEROES --> remplacer HEROES par Hero
selectedHero?: Hero;
heroes: Hero[] = [];

  // créer un constructeur privé pour l'injection des services HeroService et MessageService
// constructor(private heroService: HeroService, private messageService: MessageService) {}
  // NOTE: avec la mise en place de la navigation, on peut enlever l'injection du service messageService
constructor(private heroService: HeroService) {}

// initialisation au lancement du site
ngOnInit(): void {
  this.getHeroes();
}

// Création d'une méthode onSelect() dans le bouton de la liste des heros
// NOTE: peut être retiré avec la mise en place de la navigation
// onSelect(hero: Hero): void {
//   this.selectedHero = hero;
//   this.messageService.add('HeroesComponent: Selected hero id=${hero.id}');
// }

// Création d'une méthode pour récupérer les héros depuis le service
getHeroes(): void {
  // this.heroes = this.heroService.getHeroes();
  this.heroService.getHeroes() // avec l'utilisation de l'observable
  .subscribe(heroes => this.heroes = heroes);
}

//Création d'une méthode pour l'ajout d'un nouveau nom d'héro, et se vide une fois le nom ajouté:
add(name: string): void {
  name = name.trim();
  if (!name) { return; }
  this.heroService.addHero({ name } as Hero) // addHero() créé un nouvel objet ( -> renseigner la méthode addHero() dans hero.service.ts)
    .subscribe(hero => { // le callback .subscribe recoit le nouvel héro et l'ajoutte dans la liste des héros pour etre affiché.
      this.heroes.push(hero);
    });
}
//Création d'une méthode pour la suppression d'un héro:
delete(hero: Hero): void {
  this.heroes = this.heroes.filter(h => h !== hero);
  this.heroService.deleteHero(hero.id).subscribe(); // deleteHero() supprime un héro ( -> renseigner la méthode deleteHero() dans hero.service.ts)
}

}
