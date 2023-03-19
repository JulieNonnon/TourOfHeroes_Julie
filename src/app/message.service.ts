import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];

  //methode pour ajouter un message dans le cache
  add(message: string) {
  this.messages.push(message);
  }

  //methode pour nettoyer le cache
  clear() {
    this.messages = [];
  }

}
