import { Component } from '@angular/core';
// import du service message
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  //la propriété messageService doit être public pour pouvoir être utilisée ailleurs
  constructor(public messageService: MessageService) {}

}
