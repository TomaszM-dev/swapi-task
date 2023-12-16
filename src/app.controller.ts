import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('films')
  async getFilms() {
    try {
      const response = await this.appService.getFilms();
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }

  @Get('species')
  async getSpecies() {
    try {
      const response = await this.appService.getSpecies();
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }

  @Get('vehicles')
  async getVehicles() {
    try {
      const response = await this.appService.getVehicles();
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }

  @Get('starships')
  async getStarships() {
    try {
      const response = await this.appService.getStarships();
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }

  @Get('planets')
  async getPlanets() {
    try {
      const response = await this.appService.getPlanets();
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }
}
