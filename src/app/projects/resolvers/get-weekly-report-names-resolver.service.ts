//get-not-send-weekly-reports-by-ata-id-only-names-resolver
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { WeeklyReportsService } from "../../core/services/weekly-reports.service";

@Injectable()
export class getWeeklyReportNamesResolverService
  implements Resolve<any>
{
  constructor(private weeklyReportsService: WeeklyReportsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    return this.weeklyReportsService.getWeeklyReportNames(0, route.params.id).then((res)=>{
      return res.data;
    });
  }
}