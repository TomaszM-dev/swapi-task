import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { CachedResource } from '../cached-resource.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CachedResource)
    private readonly cachedResourceRepository: Repository<CachedResource>,
  ) {}

  // Retrieves data either from cache or by fetching from the specified function,and caches the result for future use.
  private async getCachedData<T>(
    cacheKey: string,
    fetchDataFunction: () => Promise<T>,
    cacheDuration: number = 86400,
  ): Promise<T> {
    const cachedData = await this.cachedResourceRepository.findOne({
      where: { key: cacheKey },
    });

    if (cachedData && this.isCacheValid(cachedData.createdAt, cacheDuration)) {
      try {
        const parsedData = JSON.parse(cachedData.value);
        return parsedData;
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    }

    const fetchedData = await fetchDataFunction();
    try {
      await this.cachedResourceRepository.save({
        key: cacheKey,
        value: JSON.stringify(fetchedData),
      });
    } catch (error) {
      console.error('Error saving data to cache:', error);
    }
    return fetchedData;
  }

  // Checks if the cache, created at a specific time, is still valid based on the provided cache duration.
  private isCacheValid(createdAt: Date, cacheDuration: number): boolean {
    const currentTime = new Date();
    const expirationTime = new Date(createdAt.getTime() + cacheDuration * 60);
    return currentTime < expirationTime;
  }

  // Fetches all data from a specified SWAPI endpoint.
  private async getAllData(endpoint: string) {
    try {
      const response = await axios.get(`https://swapi.dev/api/${endpoint}/`);
      return response.data.results;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch ${endpoint} from SWAPI`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Applies filtering to an array of data based on the specified title.
  private applyFiltering(data: any[], title?: string) {
    console.log('Title', title);
    if (title) {
      console.log(title);
      return data.filter(
        (item) =>
          (item.title || item.name)
            ?.toLowerCase()
            .includes(title.toLowerCase()),
      );
    }
    console.log('Data', data);
    return data;
  }

  // Applies pagination to an array of data based on the specified page and limit.
  private applyPagination(data: any[], page: number = 1, limit: number = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);
    console.log('Paginated data length:', paginatedData.length);

    return paginatedData;
  }

  // Fetches paginated and filtered data from a specified SWAPI endpoint.
  private async getPaginatedAndFilteredData(
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    title?: string,
  ) {
    const allData = await this.getAllData(endpoint);
    const filteredData = this.applyFiltering(allData, title);

    const paginatedAndFilteredData = this.applyPagination(
      filteredData,
      page,
      limit,
    );
    return paginatedAndFilteredData;
  }

  // Fetches the opening crawls of all films from the SWAPI endpoint.
  async getAllFilmOpeningCrawls() {
    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      console.log(response.data.results);
      const openingCrawls = response.data.results.map(
        (film) => film.opening_crawl,
      );

      return openingCrawls;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch opening crawls from SWAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Calculates the occurrences of unique words in an array of opening crawls.
  async getUniqueWordOccurrences(openingCrawls: string[]) {
    const cacheKey = 'uniqueWordOccurrences';
    const cachedData = await this.getCachedData<{ [word: string]: number }>(
      cacheKey,
      async () => {
        const allText = openingCrawls.join(' ');
        const words = allText.split(/\s+/);
        const wordOccurrences: { [word: string]: number } = {};

        words.forEach((word) => {
          const sanitizedWord = word.trim();
          if (sanitizedWord !== '') {
            wordOccurrences[sanitizedWord] =
              (wordOccurrences[sanitizedWord] || 0) + 1;
          }
        });

        return wordOccurrences;
      },
    );

    // Sorted wordOccurrences in escending order
    return Object.entries(cachedData).sort((a, b) => b[1] - a[1]);
  }

  // Calculates the most frequent character name by his occurrencess from openingCrawls
  async getMostFrequentCharacterName(openingCrawls: string[]) {
    const cacheKey = 'mostFrequentCharacterName';
    const cachedData = await this.getCachedData<string>(cacheKey, async () => {
      const allText = openingCrawls.join(' ');
      const characterNames: string[] = [];

      const people = await this.getAllData('people');
      people.forEach((person: any) => {
        const name = person.name;
        // If the name contains spaces, treat it as a single-word name
        characterNames.push(name.replace(/\s+/g, ' '));
      });

      const nameOccurrences: { [name: string]: number } = {};

      characterNames.forEach((name) => {
        const formattedName = name.trim();
        if (formattedName !== '') {
          const regex = new RegExp(`\\b${formattedName}\\b`, 'gi');
          const occurrences = (allText.match(regex) || []).length;
          nameOccurrences[formattedName] = occurrences;
        }
      });

      return Object.keys(nameOccurrences).reduce((a, b) =>
        nameOccurrences[a] > nameOccurrences[b] ? a : b,
      );
    });

    return cachedData;
  }

  // A generic function to fetch and cache data using the specified cache key and fetch function.
  private withCache<T>(
    cacheKey: string,
    fetchDataFunction: () => Promise<T>,
    cacheDuration: number = 86400,
  ): Promise<T> {
    return this.getCachedData(cacheKey, fetchDataFunction, cacheDuration);
  }

  // Fetches data using the id key and provided endpoint.
  async getResourceById(endpoint: string, id: string) {
    const cacheKey = `resourceById:${endpoint}:${id}`;
    const cachedData = await this.getCachedData(cacheKey, async () => {
      try {
        const response = await axios.get(
          `https://swapi.dev/api/${endpoint}/${id}`,
        );
        return response.data;
      } catch (error) {
        throw new HttpException(
          `Failed to fetch ${endpoint} with ID ${id} from SWAPI`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return cachedData;
  }

  // Fetches films with pagination and filtering based on the specified page, limit, and title.
  async getFilms(page: number = 1, limit: number = 10, param?: string) {
    const cacheKey = `films:${page}:${limit}:${param || ''}`;
    return this.withCache(cacheKey, () =>
      this.getPaginatedAndFilteredData('films', page, limit, param),
    );
  }

  // Fetches species with pagination and filtering based on the specified page, limit, and title.
  async getSpecies(page: number = 1, limit: number = 10, param?: string) {
    const cacheKey = `species:${page}:${limit}:${param || ''}`;
    return this.withCache(cacheKey, () =>
      this.getPaginatedAndFilteredData('species', page, limit, param),
    );
  }

  // Fetches vehicles with pagination and filtering based on the specified page, limit, and title.
  async getVehicles(page: number = 1, limit: number = 10, param?: string) {
    const cacheKey = `vehicles:${page}:${limit}:${param || ''}`;
    return this.withCache(cacheKey, () =>
      this.getPaginatedAndFilteredData('vehicles', page, limit, param),
    );
  }

  // Fetches starships with pagination and filtering based on the specified page, limit, and title.
  async getStarships(page: number = 1, limit: number = 10, param?: string) {
    const cacheKey = `starships:${page}:${limit}:${param || ''}`;
    return this.withCache(cacheKey, () =>
      this.getPaginatedAndFilteredData('starships', page, limit, param),
    );
  }

  // Fetches planets with pagination and filtering based on the specified page, limit, and title.
  async getPlanets(page: number = 1, limit: number = 10, param?: string) {
    const cacheKey = `planets:${page}:${limit}:${param || ''}`;
    return this.withCache(cacheKey, () =>
      this.getPaginatedAndFilteredData('planets', page, limit, param),
    );
  }
}
