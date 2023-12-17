import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/starships?param=NonExistentStarship : Expect to get an empty array for a non-existent Starship name', () => {
    return request(app.getHttpServer())
      .get('/starships?param=NonExistentStarship')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0);
      });
  });

  it('/films?&page=2&limit=2 Expect to get the second page of films with a limit of 2 ', () => {
    return request(app.getHttpServer())
      .get('/films?&page=2&limit=2')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const expectedFilm1 = {
          title: 'Return of the Jedi',
          episode_id: 6,
          director: 'Richard Marquand',
        };
        const expectedFilm2 = {
          title: 'The Phantom Menace',
          episode_id: 1,
          director: 'George Lucas',
        };

        expect(res.body).toContainEqual(expect.objectContaining(expectedFilm1));
        expect(res.body).toContainEqual(expect.objectContaining(expectedFilm2));
      });
  });

  it('/films/999 : Expect to get an error due to a fact that film of id 999 doesnt exist', () => {
    return request(app.getHttpServer())
      .get('/films/999')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          error: 'Failed to fetch film with ID 999',
        });
      });
  });

  it('/films?param=A New Hope : Expect to get film with provided param (title or name)', () => {
    return request(app.getHttpServer())
      .get('/films?param=A New Hope')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const expectedParam = 'A New Hope';
        res.body.forEach((item) => {
          expect(item.title).toEqual(expectedParam);
        });
      });
  });

  it('/species/1 : Expect to get species with unique id of 1', () => {
    return request(app.getHttpServer())
      .get('/species/1')
      .expect(200)
      .expect((res) => {
        expect(typeof res.body).toBe('object');
        const expectedSpecies = {
          name: 'Human',
          classification: 'mammal',
          designation: 'sentient',
        };
        expect(res.body).toEqual(expect.objectContaining(expectedSpecies));
      });
  });

  it('/planets?param=Tatooine : Expect to get planet with provided param (title or name)', () => {
    return request(app.getHttpServer())
      .get('/planets?param=Tatooine')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const expectedParam = 'Tatooine';
        res.body.forEach((item) => {
          expect(item.name).toEqual(expectedParam);
        });
      });
  });

  // Tests the '/films' endpoint for caching behavior.
  const cache = {};

  it('/films (GET) - expect to get catching ', async () => {
    const cachedData = cache['films'];
    if (cachedData) {
      const response = await request(app.getHttpServer())
        .get('/films')
        .set('If-None-Match', cachedData.etag);

      expect(response.status).toBe(304);
      expect(response.body).toEqual({});
    } else {
      const response = await request(app.getHttpServer()).get('/films');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      cache['films'] = {
        data: response.body,
        etag: 'films:1:10',
      };
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
