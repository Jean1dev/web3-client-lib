import { Injectable } from '@angular/core';
import axios, { AxiosStatic, AxiosInstance } from 'axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private baseUrl: string = 'http://localhost:8080'
  private baseUrl: string = 'https://rocketenvios.tk:8080'
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseUrl,
      httpsAgent: false
    })
  }

  public async atualizarToken(token: string) {
    return await this.instance.post(`/comunicacao/api-wha-token-update`, { token })
  }

  public async getToken() {
    return await this.instance.get(`/comunicacao/token`)
  }

  public async getCredit() {
    return await this.instance.get(`/comunicacao/credit`)
  }

  public async enviarMailing(mailing) {
    let formData = new FormData()
    formData.append('file', mailing)
    return await this.instance.post(`/integracao/integracao`,
      formData)
  }

  public iniciarDisparos() {
    this.instance.post(`/integracao/iniciar-fila-desconhecidos`)
  }

  public async getInfoIntegracao() {
    return await this.instance.get(`/integracao/info-integracao`)
  }

}
