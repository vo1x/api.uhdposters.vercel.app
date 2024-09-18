import axios from "axios";
import { RequestHandler } from "express";

interface MediaController {
  getMediaDetails: RequestHandler;
  getTrending: RequestHandler;
  getSearch: RequestHandler;
  getRoot: RequestHandler;
  findByID: RequestHandler;
}

interface QueryResult {
  backdrop_path: string;
  id: string;
  title: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  release_date: string;
}

const apiKey = process.env.TMDB_API_KEY;

const fetchProviders = async (mediaType: string, mediaId: string) => {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?api_key=${apiKey}`;
  try {
    const result = await fetch(url).then((data) => data.json());
    const { link, ...filteredResults } = result.results?.US;
    return Object.keys(filteredResults).map((ownership) => ({
      ownershipType: ownership,
      providers: filteredResults[ownership].map((provider: any) => ({
        name: provider.provider_name,
        logoPath: provider.logo_path,
      })),
    }));
  } catch (error: any) {
    console.log({ error: "Error fetching data" });
    return [];
  }
};

const mediaController: MediaController = {
  async getMediaDetails(req, res) {
    const { mediaType, mediaID } = req.params;
    const url = `https://api.themoviedb.org/3/${mediaType}/${mediaID}?append_to_response=external_ids,images,videos&api_key=${apiKey}`;

    try {
      const { data: info } = await axios.get(url);
      const filteredInfo = {
        id: info.id,
        title: info.name || info.title,
        release_date: info.first_air_date || info.release_date,
        genres: info.genres.map((genre: any) => genre.name),
        adult: info.adult,
        runtime: info.runtime,
        backdrop_path: info.backdrop_path,
        posters: info.images.posters,
        trailer:
          `https://youtube.com/embed/${
            info.videos.results.filter(
              (result: any) => result.type === "Trailer"
            )[0]?.key
          }` || null,
        in_production: info.in_production,
        languages: info.languages,
        last_air_date: info.last_air_date,
        last_episode_to_air: info.last_episode_to_air,
        number_of_seasons: info.number_of_seasons,
        number_of_episodes: info.number_of_episodes,
        original_language: info.original_language,
        original_name: info.original_name,
        overview: info.overview,
        poster_path: info.poster_path,
        seasons: info.seasons,
        status: info.status,
        external_ids: info.external_ids,
        providers: (await fetchProviders(mediaType, mediaID)) ?? null,
      };

      res.json(filteredInfo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error fetching media details" });
    }
  },

  async getTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    try {
      const { data } = await axios.get(url);
      const results: QueryResult[] = [];
      data.results.forEach((result: any) =>
        results.push({
          backdrop_path: result.backdrop_path,
          id: result.id,
          title: result.title || result.name,
          overview: result.overview,
          poster_path: result.poster_path,
          media_type: result.media_type,
          adult: result.adult,
          original_language: result.original_language,
          release_date: result.release_date || result.first_air_date,
        })
      );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Error fetching trending data." });
    }
  },

  async getSearch(req, res) {
    const { query: searchTerm } = req.query;
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchTerm}`;
    try {
      const { data } = await axios.get(url);
      const results: QueryResult[] = [];
      data.results
        .filter((result: any) => result.media_type !== "person")
        .forEach((result: any) =>
          results.push({
            backdrop_path: result.backdrop_path,
            id: result.id,
            title: result.title || result.name,
            original_name: result.original_name,
            overview: result.overview,
            poster_path: result.poster_path,
            media_type: result.media_type,
            adult: result.adult,
            original_language: result.original_language,
            release_date: result.release_date || result.first_air_date,
          })
        );

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Error fetching information." });
    }
  },

  async getRoot(req, res) {
    try {
      res.status(200).json("API is up and running");
    } catch (error) {
      res.status(500).json("Error.");
    }
  },

  async findByID(req, res) {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const url = `https://api.themoviedb.org/3/find/${id}?api_key=${apiKey}&external_source=imdb_id`;
    try {
      const { data } = await axios.get(url);
      let filteredResults = [];
      if (data) {
        if (data.movie_results.length > 0) {
          filteredResults = data.movie_results;
        } else if (data.tv_results.length > 0) {
          filteredResults = data.tv_results;
        } else if (data.tv_episode_results.length > 0) {
          filteredResults = data.tv_episode_results;
        } else if (data.tv_season_results.length > 0) {
          filteredResults = data.tv_season_results;
        }
      }
      const results: QueryResult[] = [];
      filteredResults
        .filter((result: any) => result.media_type !== "person")
        .forEach((result: any) =>
          results.push({
            backdrop_path: result.backdrop_path,
            id: result.id,
            title: result.title || result.name,
            original_name: result.original_name,
            overview: result.overview,
            poster_path: result.poster_path,
            media_type: result.media_type,
            adult: result.adult,
            original_language: result.original_language,
            release_date: result.release_date || result.first_air_date,
          })
        );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data" });
    }
  },
};

export default mediaController;
