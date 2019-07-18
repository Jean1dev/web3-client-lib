import { ApiService } from './../api.service';
import { Component } from '@angular/core';

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

  constructor(public api: ApiService) { }

  ionViewDidEnter() {
    this.segment = "enviados"
    this.api.getInfoIntegracao().then(res => {
      if (!res) return
      this.prepareObjectList(res.data)
    })
  }

  private prepareObjectList(list) {
    this.listEnvios = list.map((item: any) => {
      return {
        status: item.detalhes.success,
        message: item.mensagem_enviada,
        from : item.telefone_enviado
      }
    })
  }
}
