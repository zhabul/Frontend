import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable} from 'rxjs';
import { ProjectsService } from 'src/app/core/services/projects.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsResolver implements Resolve<Object> {
  constructor(private projectsService:ProjectsService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    return this.projectsService.getAllProjectsForAnalysis(null);
  }
}
