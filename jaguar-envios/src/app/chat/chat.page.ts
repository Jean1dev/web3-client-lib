import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public detailsParams: any
  public messages = []
  public newMessage: string
  public nickname: string = "eu"

  constructor(private socket: Socket, public route: ActivatedRoute) {
    this.socket.connect()
    this.detailsParams = route.snapshot.queryParams
    this.addMessage(this.detailsParams)
  }

  ngOnInit() {
  }

  public sendMessage() {
    this.addMessage({
      to: 'eu',
      text: this.newMessage,
      createdAt: new Date()
    })

    this.socket.emit('client-send-message',
      { message: this.newMessage, paraQuem: this.detailsParams.to })
    this.newMessage = ""
  }

  private addMessage(messageDetails) {
    let conteudo = {
      from: messageDetails.to,
      text: messageDetails.text,
      createdAt: messageDetails.createdAt
    }
    this.messages.push(conteudo)
  }

}
