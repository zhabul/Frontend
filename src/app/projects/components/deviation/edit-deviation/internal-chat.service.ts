import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { DeviationChatService } from './deviation-chat/deviation-chat-http-service';

@Injectable({
    providedIn: 'root',
})
export class InternalChatStore {
    private _newMessageEvent$: Subject<any> = new Subject();
    public readonly newMessageEvent$: Observable<any> = this._newMessageEvent$.asObservable();

    private _messageStore$: BehaviorSubject<any> = new BehaviorSubject({ fetched: false, data: []});
    public readonly messageStore$: Observable<any> = this._messageStore$.asObservable();

    constructor(public deviationChatService: DeviationChatService,) {}

    public addMessageToStore(data) {
        this._messageStore$.next({ fetched: true, data: data });
    }
 
    public nextMessage(contact) {
        this._newMessageEvent$.next(contact);
    }

    getChatMessages(deviationId) {
        this.deviationChatService.getChatByDeviationId(deviationId).then((res: { status: boolean; data: any[] })=>{
            this.addMessageToStore(res.data);
        });
    }
    
    clearMessages() {
        this._messageStore$.next({ fetched: false, data: []});
    }
}