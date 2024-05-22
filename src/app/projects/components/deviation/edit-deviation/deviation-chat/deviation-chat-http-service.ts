import {EventEmitter, Injectable, Output} from '@angular/core';
import {BASE_URL} from '../../../../../config/index';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeviationChatService {

  private getChatByDeviationIdUrl: string = BASE_URL + 'api/projects/getChatByDeviationId';
 
  public projectsRoute = 'projects';
  @Output() userStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) { }

    public getChatByDeviationId(deviationId) {
        const headers = new HttpHeaders();
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.get(`${this.getChatByDeviationIdUrl}/${deviationId}`, { headers: headers }).toPromise()
          .then(response => response)
          .catch(err => {
            return [];
        });         
    }
}
