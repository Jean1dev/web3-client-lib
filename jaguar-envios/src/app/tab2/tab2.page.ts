import { ApiService } from './../api.service';
import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [
    ApiService
  ]
})
export class Tab2Page {

  public listEnvios: any
  public segment: string;
  public messages = [];
  public nickname: string = ""

  constructor(
    public api: ApiService,
    private socket: Socket,
    public nav: Router) {
    this.prepareSocketClient()

    this.getMessages().subscribe(message => {
      console.log(message)
      this.messages.push(message);
    });
  }

  ionViewDidEnter() {
    this.segment = "enviados"
    this.api.getInfoIntegracao().then(res => {
      if (!res) return
      this.prepareObjectList(res.data)
    })
  }

  public openChat(messageDetail) {
    this.nav.navigate(['chat'], {queryParams: messageDetail})
  }

  private prepareObjectList(list) {
    this.listEnvios = list.map((item: any) => {
      return {
        status: item.detalhes.success,
        message: item.mensagem_enviada,
        from: item.telefone_enviado
      }
    })
  }

  private prepareSocketClient() {
    this.socket.connect();
    //this.socket.emit('send-server', "conectado")
  }

  private getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
