// NOTE SERVER: Le fichier in-memory-data.service.ts prend la relève sur mock-heroes.ts. 
//On garde le fichier mock-heroes.ts pour l'instant, on en aura encore besoin par la suite.

import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12, name: '🥭Crash Bandicoot' },
      { id: 13, name: '💎Spyro' },
      { id: 14, name: '🥾Lara Croft' },
      { id: 15, name: '🌱Rayman' },
      { id: 16, name: '💀Sir Daniel Fortesque' },
      { id: 17, name: '📺Gex' },
      { id: 18, name: '💍Klonoa' },
      { id: 19, name: '🧩Croc' },
      { id: 20, name: '🐽Tombi' }
    ];
    return {heroes};
  }

  // Ecrase la méthode genId pour faire en sorte qu'un héro ait toujours un id.
  // Si le tableau heroes est vide, la méthode ci-dessous retourne le chiffre initial (11).
  // Si le tableau heroes n'est PAS vide, la méthode ci-dessous retourne l'id hero le plus élevé + 1:
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
