import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  // Retrieves all data from a specified SWAPI endpoint
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

  // Applies filtering  based on the specified title or name.
  private applyFiltering(data: any[], param?: string) {
    console.log('Title', param);
    if (param) {
      return data.filter(
        (item) =>
          //  if title doesnt exist on item. Use name for filtration instead
          (item.title || item.name)
            ?.toLowerCase()
            .includes(param.toLowerCase()),
      );
    }
    return data;
  }

  // Applies pagination to an array of data.
  private applyPagination(data: any[], page: number = 1, limit: number = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);
    console.log('Paginated data length:', paginatedData.length);

    return paginatedData;
  }

  //  Retrieves, filters, and paginates data from a SWAPI endpoint.
  private async getPaginatedAndFilteredData(
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    param?: string,
  ) {
    const allData = await this.getAllData(endpoint);
    const filteredData = this.applyFiltering(allData, param);

    const paginatedAndFilteredData = this.applyPagination(
      filteredData,
      page,
      limit,
    );
    return paginatedAndFilteredData;
  }

  async getResourceById(endpoint: string, id: string) {
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
  }

  async getFilms(page: number = 1, limit: number = 10, param?: string) {
    return this.getPaginatedAndFilteredData('films', page, limit, param);
  }

  async getSpecies(page: number = 1, limit: number = 10, param?: string) {
    return this.getPaginatedAndFilteredData('species', page, limit, param);
  }

  async getVehicles(page: number = 1, limit: number = 10, param?: string) {
    return this.getPaginatedAndFilteredData('vehicles', page, limit, param);
  }

  async getStarships(page: number = 1, limit: number = 10, param?: string) {
    return this.getPaginatedAndFilteredData('starships', page, limit, param);
  }

  async getPlanets(page: number = 1, limit: number = 10, param?: string) {
    return this.getPaginatedAndFilteredData('planets', page, limit, param);
  }
}
