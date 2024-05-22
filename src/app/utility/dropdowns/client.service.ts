import { Injectable } from '@angular/core';
import { Client, Partners } from './client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor() { }

  clients: Client[] = [
    {id: 1, Name: 'ABB Bygg Sverige AB'},
    {id: 2, Name: 'AF Bygg Göteborg AB'},
    {id: 3, Name: 'AF Bygg Syd AB'},
    {id: 4, Name: 'AF Bygg Göteborg AB'},
    {id: 5, Name: 'Andreasson & Lundström Byggnad'},
    {id: 6, Name: 'Andric Förvaltning AB'},
    {id: 7, Name: 'Bruno'},
  ];

  partners: Partners[] = [
    {id: 1, Name: 'Kontaktperson'},
    {id: 2, Name: 'Underleverantor'},
    {id: 3, Name: 'xxxxx'},
    {id: 4, Name: 'xxx'},
    {id: 5, Name: 'xxx'},
    {id: 6, Name: 'xxxx'},
    {id: 7, Name: 'xxxx'},
  ];

}
