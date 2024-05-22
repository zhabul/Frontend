//get-not-send-weekly-reports-by-ata-id-only-names-resolver
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AtaService } from "../../core/services/ata.service";

@Injectable()
export class GetNotSendWeeklyReportsByAtaIdOnlyNamesResolverService
  implements Resolve<any>
{
  constructor(private ataService: AtaService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.ataService.getNotSendWeeklyReportsByAtaIdOnlyNames(route.params.id).then((res)=>{
      return res.data;
    });
  }
}
