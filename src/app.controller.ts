import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('films')
  async getFilms(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('param') param: string,
  ) {
    try {
      const films = await this.appService.getFilms(page, limit, param);
      return films;
    } catch (error) {
      console.error('Error fetching films:', error.message);
      return {
        error: 'Failed to fetch films',
      };
    }
  }

  //  Retrieves a specific film by its ID from the SWAPI.
  @Get('films/:id')
  async getFilmById(@Param('id') id: string) {
    try {
      const film = await this.appService.getResourceById('films', id);

      return film;
    } catch (error) {
      console.error(`Error fetching film with ID ${id}:`, error.message);
      return {
        error: `Failed to fetch film with ID ${id}`,
      };
    }
  }

  @Get('films/opening-crawls/unique-words')
  async getUniqueWordOccurrences() {
    try {
      const openingCrawls = await this.appService.getAllFilmOpeningCrawls();
      const uniqueWordOccurrences =
        await this.appService.getUniqueWordOccurrences(openingCrawls);
      return { uniqueWordOccurrences };
    } catch (error) {
      console.error('Error fetching unique word occurrences:', error.message);
      return {
        error: 'Failed to fetch unique word occurrences',
      };
    }
  }

  @Get('films/opening-crawls/most-frequent-character-name')
  async getMostFrequentCharacterName() {
    try {
      const openingCrawls = await this.appService.getAllFilmOpeningCrawls();
      const mostFrequentCharacterName =
        await this.appService.getMostFrequentCharacterName(openingCrawls);

      return {
        mostFrequentCharacterName,
      };
    } catch (error) {
      console.error(
        'Error fetching most frequent character name:',
        error.message,
      );
      return {
        error: 'Failed to fetch most frequent character name',
      };
    }
  }

  @Get('species')
  async getSpecies(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('param') param: string,
  ) {
    try {
      const species = await this.appService.getSpecies(page, limit, param);
      return species;
    } catch (error) {
      console.error('Error fetching species:', error.message);
      return {
        error: 'Failed to fetch species',
      };
    }
  }

  //  Retrieves a specific species by its ID from the SWAPI.
  @Get('species/:id')
  async getSpeciesById(@Param('id') id: string) {
    try {
      const species = await this.appService.getResourceById('species', id);
      return species;
    } catch (error) {
      console.error(`Error fetching species with ID ${id}:`, error.message);
      return {
        error: `Failed to fetch species with ID ${id}`,
      };
    }
  }

  @Get('vehicles')
  async getVehicles(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('param') param: string,
  ) {
    try {
      const vehicles = await this.appService.getVehicles(page, limit, param);
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      return {
        error: 'Failed to fetch vehicles',
      };
    }
  }

  //  Retrieves a specific vehicles by its ID from the SWAPI.
  @Get('vehicles/:id')
  async getVehiclesById(@Param('id') id: string) {
    try {
      const vehicle = await this.appService.getResourceById('vehicles', id);
      return vehicle;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error.message);
      return {
        error: `Failed to fetch vehicle with ID ${id}`,
      };
    }
  }

  @Get('starships')
  async getStarships(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('param') param: string,
  ) {
    try {
      const starships = await this.appService.getStarships(page, limit, param);
      return starships;
    } catch (error) {
      console.error('Error fetching starships:', error.message);
      return {
        error: 'Failed to fetch starships',
      };
    }
  }

  //  Retrieves a specific starships by its ID from the SWAPI.
  @Get('starships/:id')
  async getStarshipsById(@Param('id') id: string) {
    try {
      const starship = await this.appService.getResourceById('starships', id);
      return starship;
    } catch (error) {
      console.error(`Error fetching starship with ID ${id}:`, error.message);
      return {
        error: `Failed to fetch starship with ID ${id}`,
      };
    }
  }

  @Get('planets')
  async getPlanets(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('param') param: string,
  ) {
    try {
      const planets = await this.appService.getPlanets(page, limit, param);
      return planets;
    } catch (error) {
      console.error('Error fetching starships:', error.message);
      return {
        error: 'Failed to fetch starships',
      };
    }
  }

  //  Retrieves a specific planets by its ID from the SWAPI.
  @Get('planets/:id')
  async getPlanetsById(@Param('id') id: string) {
    try {
      const planet = await this.appService.getResourceById('planets', id);
      return planet;
    } catch (error) {
      console.error(`Error fetching planet with ID ${id}:`, error.message);
      return {
        error: `Failed to fetch planet with ID ${id}`,
      };
    }
  }
}
