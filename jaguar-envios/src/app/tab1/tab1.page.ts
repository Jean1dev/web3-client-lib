import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

declare var document

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [
    ApiService
  ]
})
export class Tab1Page {

  public token: string = ""
  public mailing: string = ""
  public credit: string = ""
  private loading: any

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public api: ApiService) { }

  async ionViewDidEnter() {
    await this.presentLoading()
    this.getToken()
    this.getCredito()
    this.dismissLoading()
  }

  public async atualizarToken() {
    await this.presentLoading()
    let result: any = await this.api.atualizarToken(this.token)
    this.presentToast(result.data)
    this.dismissLoading()
  }

  public async getToken() {
    let retorno: any = await this.api.getToken()
    this.token = retorno.data || ""
  }

  public async enviarMailing() {
    let file: any = document.getElementById('arquivomailing').files[0]
    if (!file) {
      this.presentToast('selecione um arquivo')
      return
    }
    await this.presentLoading()
    let result = await this.api.enviarMailing(file)
    this.presentToast(result.data)
    this.dismissLoading()
  }

  public disparar(): void {
    this.api.iniciarDisparos()
    this.presentToast("iniciando fila de disparos")
    setTimeout(() => {
      this.getCredito()
    }, 10000)
  }

  private async getCredito() {
    let retorno: any = await this.api.getCredit()
    this.credit = retorno.data.credit || ""
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Aguarde'
    })
    this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss()
  }

  async presentToast(message: any) {
    message = JSON.stringify(message)
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
