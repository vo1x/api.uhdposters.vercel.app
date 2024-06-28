const axios = require("axios");

const apiKey = process.env.TMDB_API_KEY;
exports.getMediaDetails = async (req, res) => {
  const { mediaType, mediaID } = req.params;
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaID}?append_to_response=external_ids,images,videos&api_key=${apiKey}`;

  try {
    const { data: info } = await axios.get(url);
    const filteredInfo = {
      id: info.id,
      title: info.name || info.title,
      release_date: info.first_air_date || info.release_date,
      genres: info.genres.map((genre) => genre.name),
      adult: info.adult,
      runtime: info.runtime,
      backdrop_path: info.backdrop_path,
      posters: info.images.posters,
      videos: info.videos.results.filter((result) => result.type === "Trailer"),
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
    };

    res.json(filteredInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching media details" });
  }
};

exports.getTrending = async (req, res) => {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
  try {
    const { data } = await axios.get(url);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trending data." });
  }
};

exports.getSearch = async (req, res) => {
  const { query: searchTerm } = req.query;
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchTerm}`;
  try {
    const { data } = await axios.get(url);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: "Error fetching information." });
  }
};
