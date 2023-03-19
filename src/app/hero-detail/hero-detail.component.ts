import { Component, Input } from '@angular/core';
// import de l'interface hero
import { Hero } from '../hero';

//NAVIGATION: Ajout des imports suivant qui seront utlisé dans le constructeur:
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {

// création de l'input: on créé le décorateur @Input avec une propriété hero. 
//Ce composant reçoit uniquement un objet hero via sa propriété hero, et l'affiche
@Input() hero?: Hero;



// NAVIGATION: injection des éléments importés dans le constructeur, chacun étant en privé:
constructor (
  private route: ActivatedRoute, //garde en mémoire l'info de la route paramétrée, (le "id" de l'URL est l'id du héro)
  private heroService: HeroService, // recoit la donnée du héro depuis le server remote, ce composant l'utilise pour recevoir le héro à afficher
  private location: Location // Service d'Angular pour interréagir avec le navigateur -> permet de revenir en arrière (sur la vue précédement consultée)
) {}

ngOnInit(): void {
  this.getHero();
}

getHero(): void {
  const id = Number(this.route.snapshot.paramMap.get('id')); // route.snapshot est une image statique de l'info de la route juste après que le composant a été créé. paramMap recupère l'info "id" de l'URL pour retourner l'id du héro qu'on appelle (c'est toujours un string)
  this.heroService.getHero(id)
    .subscribe(hero => this.hero = hero);
}

//Création de la méthode permettant le retour sur la page précédement consultée, avec l'import de Location plus haut
goBack(): void {
  this.location.back();
}

//Création de la méthode permettant la conservation/sauvegarde des données modifiées quand on navigue sur l'app, avec la méthode updateHero() importée depuis le service hero.service.ts
save(): void {
  if (this.hero) {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}


}
