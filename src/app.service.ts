import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  async getFilms(): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.API_URL}/films/`);
  }

  async getSpecies(): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.API_URL}/species/`);
  }

  async getVehicles(): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.API_URL}/vehicles/`);
  }

  async getStarships(): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.API_URL}/starships/`);
  }

  async getPlanets(): Promise<AxiosResponse<any>> {
    return axios.get(`${process.env.API_URL}/planets/`);
  }
}
