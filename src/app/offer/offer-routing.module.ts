import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { OfferComponent } from "./components/offer.component";
import { OfferResolverService } from "./resolvers/offer-resolver.service";
// import { MajorProjectResolverService } from "./resolvers/major-project-resolver.service";
import { ClientsResolverService } from "./resolvers/clients-resolver.service";
import { UnitsResolverService } from "../materials/resolvers/units-resolver.service";

import { OffersResolverService } from "./resolvers/offers-resolver.service";
import { ClientCategoriesResolverService } from "../clients/resolvers/client-categories-resolver.service";
import { AllUsersResolver } from "../users/resolvers/all-users-resolver.service";
import { UsersResolver } from "./resolvers/users-resolver.service";
import { GenerateOfferNumberResolverService } from "./resolvers/generate-offer-num-resolver.service";
import { OfferEditorComponent } from './components/offer-editor/offer-editor.component';
import { GeneralsSortedByKeyResolver } from "../generals/resolvers/generals-sorted-by-key-resolver.service";

//import { NewOfferComponent } from "./components/new-offer/new-offer.component";
//import { EditOfferComponent } from "./components/edit-offer/edit-offer.component";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: "",
        component: OfferComponent,
        resolve: {
          offers: OffersResolverService,
          getNextOfferNum: GenerateOfferNumberResolverService,
         },
      },
      {
        path: "new",
        component: OfferEditorComponent,
        resolve: {
          getNextOfferNum: GenerateOfferNumberResolverService,
          // projects: MajorProjectResolverService,
          clients: ClientsResolverService,
          units: UnitsResolverService,
          clientCategories: ClientCategoriesResolverService,
          users: AllUsersResolver
        },
      },
      {
        path: ":id",
        component: OfferEditorComponent,
        resolve: {
          getNextOfferNum: GenerateOfferNumberResolverService,
          // projects: MajorProjectResolverService,
          clients: ClientsResolverService,
          units: UnitsResolverService,
          clientCategories: ClientCategoriesResolverService,
          users: AllUsersResolver,
          generals: GeneralsSortedByKeyResolver
        },
      },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
  providers: [
    OfferResolverService,
    OffersResolverService,
    // MajorProjectResolverService,
    ClientsResolverService,
    UnitsResolverService,
    ClientCategoriesResolverService,
    AllUsersResolver,
    UsersResolver,
    GenerateOfferNumberResolverService,
    GeneralsSortedByKeyResolver
  ],
})
export class OfferRoutingModule {}


