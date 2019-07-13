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
    return await this.instance.post(`/api-wha-token-update`, { token })
  }

  public async getToken() {
    return await this.instance.get(`/token`)
  }

  public async getCredit() {
    return await this.instance.get(`/credit`)
  }

  public async enviarMailing(mailing) {
    let formData = new FormData()
    formData.append('file', mailing)
    return await this.instance.post(`/integracao`,
      formData)
  }

  public iniciarDisparos() {
    this.instance.post(`/iniciar-fila-desconhecidos`)
  }

}
