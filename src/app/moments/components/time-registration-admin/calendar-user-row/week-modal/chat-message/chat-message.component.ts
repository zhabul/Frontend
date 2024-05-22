import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css', '../week-modal.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input('data') data;
  @Input('index') set setIndex(value) {
    if (value != this.index) {
      this.index = value;
    }
  }; 
  @Input('user') user;
  @Input('currentUserId') currentUserId;
  @Input('messagesLength') set setMessagesLength(value) {
    if (value != this.messagesLength) {
      this.messagesLength = value;
      this.setSeenCondition();
    }
  };
  public index = 0;
  public messagesLength = 0;
  public seenVisible = false;
  public chatType = 'user-chat';
  public chatStyle = {};
  public chatTextAlign = 'right';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.setChatType();
    this.setChatStyle();
    this.setChatTextAlign();
    this.setSeenCondition();
  }

  setSeenCondition() {
    if (this.data.opened == 1 && this.index == (this.messagesLength - 1) && this.chatType == 'admin-chat') {
      this.seenVisible = true;
      return;
    }
    this.seenVisible = false;
  }

  setChatType() {
    if (this.user.id != this.data.user_id) {
      this.chatType = 'admin-chat';
    }
  }

  setChatStyle() {
    this.chatStyle = {
      justifyContent: this.chatType !== 'admin-chat' ? 'left' : 'right',
      marginLeft:  this.chatType !== 'admin-chat' ? '0' : '9%',
      marginRight: this.chatType !== 'admin-chat' ? '9%' : '0'
    }
  }

  setChatTextAlign() {
    if (this.chatType !== 'admin-chat') {
      this.chatTextAlign = 'left';
    }
  }

  openSwiper(index, images) {
    this.chatService.setOpenGallery({ index, images });
  }
}