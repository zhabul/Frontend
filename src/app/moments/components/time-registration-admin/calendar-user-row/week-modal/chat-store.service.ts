import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { BASE_URL } from "../../../../../config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as moment from "moment";

@Injectable()
export class ChatStore {
  private getLast3Month_chat_by_date_Url: string =
    BASE_URL + "api/timesheet/getLast3Month_chat_by_date";

  private _state$: BehaviorSubject<any> = new BehaviorSubject({});
  public readonly state$: Observable<any> = this._state$.asObservable();

  public getChatsub;

  constructor(private http: HttpClient) {}

  setState(state): void {
    this._state$.next(state);
  }

  get state() {
    return this._state$.getValue();
  }

  initializeChat(date, userId, limit, offset) {
    this._state$.next({
      [userId]: {
        data: { messages: {}, offset: null, opened_count: {} },
        sending: false
      }
    });
    this.sendingStateById(date, userId, true);
    this.getChat(date, userId, limit, offset);
  }
  

  getChat(date, userId, limit, offset) {
    this.getChatsub = this.getChatByUserIdAndDate(date, userId, limit, offset).subscribe(
      (res: { status: boolean; data: any }) => {
        if (res.status) {
          const data = Array.isArray(res.data)
            ? { messages: {}, offset: null, opened_count: {} }
            : res.data;
          const offset_ = this.decideOnOffsetValue(offset, data);
          this.addDataToState(data, userId, offset_);
        } else {
          this.sendingStateById(date, userId, false);
        }
      }
    );
  }

  unsubFromGetChat() {
    if (this.getChatsub) {
      this.getChatsub.unsubscribe();
    }
  }

  decideOnOffsetValue(offset, data) {
    if (data.offset === null) return null;
    if (offset == 0) return 500;
    return offset + 500;
  } 

  distributeDataMessages(userId, messages) {
    const stateMessages = { ...this.state[userId].data.messages };
    const weekKeys = Object.keys(messages);

    for (let i = 0; i < weekKeys.length; i++) {
      const week = weekKeys[i];
      if (!stateMessages[week]) {
        stateMessages[week] = messages[week];
        continue;
      }
      stateMessages[week] = stateMessages[week].concat(messages[week]);
    }

    return stateMessages;
  }

  addDataToState(data, userId, offset) {
    const opened_count = data.opened_count;

    const messages = this.distributeDataMessages(userId, data.messages);

    const newState = {
      ...this.state,
      [userId]: {
        ...this.state[userId],
        sending: false,
        data: {
          ...this.state[userId].data,
          messages: messages,
          offset: offset,
          opened_count: {
            ...this.state[userId].data.opened_count,
            ...opened_count,
          },
        },
      },
    };
    this._state$.next(newState);
  }

  sendingStateById(date, userId, state) {
    const newState = this.state;
    if (!newState[userId]) {
      newState[userId] = {
        sending: state,
        data: { messages: {}, opened_count: {}, offset: 500 },
        date: date,
      };
    } else {
      newState[userId] = { ...newState[userId], sending: state, date: date };
    }
    this._state$.next(newState);
  }

  addMessage({ userId, week, message, content_type }: any) {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const user_id = userDetails.user_id;
    const newState = this.state;
    const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const msgObj = {
      message: message,
      full_name: `${userDetails.firstname} ${userDetails.lastname}`,
      created_message: currentDate,
      user_id: user_id,
      created_at: currentDate,
      updated_at: currentDate,
      opened: "1",
      week_id: -1,
      message_id: -1,
      content_type: content_type,
    };

    if (!newState[userId].data.messages[week]) {
      newState[userId] = {
        ...newState[userId],
        data: {
          messages: { ...newState[userId].data.messages, [week]: [msgObj] },
          offset: 500,
          opened_count: {}
        },
      };
    } else {
      const newData = newState[userId].data.messages[week].slice();
      msgObj.message_id = Number(newData[newData.length - 1].message_id) + 1;
      msgObj.week_id = newData[0].week_id;
      newData.push(msgObj);
      newState[userId] = {
        ...newState[userId],
        data: {
          ...newState[userId].data,
          messages: { ...newState[userId].data.messages, [week]: newData },
        },
      };
    }
    this._state$.next(newState);
  }

  removeUser(userId) {
    this.unsubFromGetChat()
    this._state$.next({
      [userId]: {
      data: { messages: {}, offset: null, opened_count: {} },
      sending: false
    }});
  }

  getChatByUserIdAndDate(date, userId, limit, offset) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .get(
        `${this.getLast3Month_chat_by_date_Url}/${date}/${userId}/${limit}/${offset}`,
        { headers: headers }
      )
      .pipe(catchError(() => of({ status: false })));
  }
}
