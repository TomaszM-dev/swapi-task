import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Retrieves a list of films with optional pagination and search parameters.
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

  // Retrieves details of a film based on the provided film ID.
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

  // Retrieves unique word occurrences in opening crawls of all films.
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

  // Retrieves the most frequently mentioned character name in opening crawls of all films.
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

  // Retrieves a list of species with optional pagination and search parameters.
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

  // Retrieves details of a species based on the provided species ID.
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

  // Retrieves a list of vehicles with optional pagination and search parameters.
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

  // Retrieves details of a vehicle based on the provided vehicle ID.
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

  // Retrieves a list of starships with optional pagination and search parameters.
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

  // Retrieves details of a starship based on the provided starship ID.
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

  // Retrieves a list of planets with optional pagination and search parameters.
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

  // Retrieves details of a planet based on the provided planet ID.
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
