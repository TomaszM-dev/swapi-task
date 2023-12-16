import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('films')
  async getFilms(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const films = await this.appService.getFilms(page, limit, title);
      return films;
    } catch (error) {
      console.error('Error fetching films:', error.message);
      return {
        error: 'Failed to fetch films',
      };
    }
  }

  @Get('species')
  async getSpecies(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const species = await this.appService.getSpecies(page, limit, title);
      return species;
    } catch (error) {
      console.error('Error fetching species:', error.message);
      return {
        error: 'Failed to fetch species',
      };
    }
  }

  @Get('vehicles')
  async getVehicles(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const vehicles = await this.appService.getVehicles(page, limit, title);
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      return {
        error: 'Failed to fetch vehicles',
      };
    }
  }

  @Get('starships')
  async getStarships(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const starships = await this.appService.getStarships(page, limit, title);
      return starships;
    } catch (error) {
      console.error('Error fetching starships:', error.message);
      return {
        error: 'Failed to fetch starships',
      };
    }
  }

  @Get('planets')
  async getPlanets(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
  ) {
    try {
      const planets = await this.appService.getPlanets(page, limit, title);
      return planets;
    } catch (error) {
      console.error('Error fetching starships:', error.message);
      return {
        error: 'Failed to fetch starships',
      };
    }
  }
}
