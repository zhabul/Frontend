import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ClientsService } from "../../core/services/clients.service";

@Injectable()
export class ClientCategoriesResolverService implements Resolve<any> {
  constructor(private clientsService: ClientsService) {}

  resolve(): Observable<any> {
    return this.clientsService.getClientCategories();
  }
}
