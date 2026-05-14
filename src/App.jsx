import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, AlertCircle, Play, Tv, Film, ChevronDown, ChevronUp, Globe, ArrowLeft, ChevronRight, ChevronLeft, Star, TrendingUp, Flame, Award, Clapperboard, Ghost, Laugh, Wand2, Swords, Heart, Sparkles, MonitorPlay, Popcorn } from 'lucide-react'

const RT_HOT_SVG = <img src="/assets/rt-popcorn.png" className="rt-icon-small" />

const LANG_ORDER = ['pt-BR', 'en', 'es']

const translations = {
  'pt-BR': {
    placeholder: 'Busque em qualquer idioma...',
    loading: 'Sincronizando notas...',
    notFound: 'Filme não encontrado!',
    apiError: 'Erro ao buscar dados da API.',
    seeMore: 'Ver tudo',
    seeLess: 'Ver menos',
    watchTrailer: 'Assistir Trailer',
    critics: 'Críticos',
    audience: 'Público',
    seasonEpisodes: 'Avaliações por Episódio',
    loadingEpisodes: 'Carregando episódios...',
    categories: 'Categorias',
    popular: 'Descobertas de ' + new Date().getFullYear(),
    topRated: 'Mais Bem Avaliados',
    similarTitles: 'Títulos Similares',
    newReleases: 'Lançamentos ' + new Date().getFullYear(),
    newSeries: 'Séries em Destaque',
    newAnime: 'Animes Populares',
    explore: 'Explorar',
    heroTitle: 'Todas as notas.\nUm só lugar.',
    heroSubtitle: 'Compare avaliações do IMDb, Rotten Tomatoes, Metacritic e Letterboxd instantaneamente.',
  },
  en: {
    placeholder: 'Search in any language...',
    loading: 'Syncing scores...',
    notFound: 'Movie not found!',
    apiError: 'Error fetching API data.',
    seeMore: 'See more',
    seeLess: 'See less',
    watchTrailer: 'Watch Trailer',
    critics: 'Critics',
    audience: 'Audience',
    seasonEpisodes: 'Episode Ratings',
    loadingEpisodes: 'Loading episodes...',
    categories: 'Categories',
    popular: new Date().getFullYear() + ' Discoveries',
    topRated: 'Top Rated',
    similarTitles: 'Similar Titles',
    newReleases: new Date().getFullYear() + ' Releases',
    newSeries: 'Trending Series',
    newAnime: 'Popular Anime',
    explore: 'Explore',
    heroTitle: 'All scores.\nOne place.',
    heroSubtitle: 'Compare IMDb, Rotten Tomatoes, Metacritic, and Letterboxd ratings instantly.',
  },
  es: {
    placeholder: 'Busca en cualquier idioma...',
    loading: 'Sincronizando notas...',
    notFound: '¡Película no encontrada!',
    apiError: 'Error al buscar datos de la API.',
    seeMore: 'Ver todo',
    seeLess: 'Ver menos',
    watchTrailer: 'Ver Tráiler',
    critics: 'Críticos',
    audience: 'Audiencia',
    seasonEpisodes: 'Calificaciones por Episodio',
    loadingEpisodes: 'Cargando episodios...',
    categories: 'Categorías',
    popular: 'Descubrimientos de ' + new Date().getFullYear(),
    topRated: 'Mejor Calificados',
    similarTitles: 'Títulos Similares',
    newReleases: 'Estrenos ' + new Date().getFullYear(),
    newSeries: 'Series Destacadas',
    newAnime: 'Animes Populares',
    explore: 'Explorar',
    heroTitle: 'Todas las notas.\nEn un solo lugar.',
    heroSubtitle: 'Compara calificaciones de IMDb, Rotten Tomatoes, Metacritic y Letterboxd instantáneamente.',
  }
}

const CATEGORIES = [
  { id: 'action', icon: Swords, label: { 'pt-BR': 'Ação', en: 'Action', es: 'Acción' }, color: '#ef4444', query: ['Mad Max: Fury Road', 'John Wick', 'Gladiator', 'Top Gun: Maverick', 'The Dark Knight', 'Kill Bill'] },
  { id: 'drama', icon: Heart, label: { 'pt-BR': 'Drama', en: 'Drama', es: 'Drama' }, color: '#8b5cf6', query: ['The Shawshank Redemption', 'Forrest Gump', 'Schindler\'s List', 'The Godfather', 'Fight Club', 'Parasite'] },
  { id: 'scifi', icon: Wand2, label: { 'pt-BR': 'Ficção Científica', en: 'Sci-Fi', es: 'Ciencia Ficción' }, color: '#06b6d4', query: ['Interstellar', 'Blade Runner 2049', 'Arrival', 'Dune', 'The Matrix', 'Inception'] },
  { id: 'comedy', icon: Laugh, label: { 'pt-BR': 'Comédia', en: 'Comedy', es: 'Comedia' }, color: '#f59e0b', query: ['The Grand Budapest Hotel', 'Superbad', 'The Hangover', 'Jojo Rabbit', 'Borat', 'Knives Out'] },
  { id: 'horror', icon: Ghost, label: { 'pt-BR': 'Terror', en: 'Horror', es: 'Terror' }, color: '#10b981', query: ['Get Out', 'Hereditary', 'The Shining', 'A Quiet Place', 'Midsommar', 'It'] },
  { id: 'animation', icon: Clapperboard, label: { 'pt-BR': 'Animação', en: 'Animation', es: 'Animación' }, color: '#ec4899', query: ['Spider-Man: Into the Spider-Verse', 'Spirited Away', 'Coco', 'The Lion King', 'Inside Out', 'Your Name'] },
]

// 2026 releases in chronological order (Jan → May 2026)
const NEW_RELEASES_2026 = [
  'The Devil Wears Prada 2',     // May 1
  'Michael',                      // Apr 24
  'The Super Mario Galaxy Movie', // Apr 3
  'Project Hail Mary',            // Mar 20
  'Hoppers',                      // Mar 6
  'Scream 7',                     // Feb 27
  'Wuthering Heights',            // Feb 13
  '28 Years Later: The Bone Temple', // Jan 16
]

// 2026 series
const TRENDING_SERIES_2026 = ['The Boys', 'Severance', 'The Last of Us', 'Bridgerton', 'Hacks', 'Fallout', 'Shogun', 'Arcane']

// 2026 anime + recent popular
const TRENDING_ANIME = ['Jujutsu Kaisen', 'One Piece', 'Demon Slayer', 'Frieren: Beyond Journey\'s End', 'Spy x Family', 'Chainsaw Man', 'Vinland Saga', 'Attack on Titan']

// All-time (static, doesn't need updating)
const TOP_RATED_MOVIES = ['The Shawshank Redemption', 'The Godfather', 'Pulp Fiction', 'Schindler\'s List', 'Fight Club', 'Forrest Gump', 'The Matrix', 'Goodfellas']

// Search terms used to dynamically discover movies by year from OMDB
const DISCOVERY_TERMS = ['the', 'man', 'love', 'night', 'world', 'last', 'star', 'new', 'dark', 'war']

function App() {
  const [lang, setLang] = useState('pt-BR')
  const t = translations[lang]
  const [searchTerm, setSearchTerm] = useState('')
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [seasons, setSeasons] = useState([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [isPlotExpanded, setIsPlotExpanded] = useState(false)
  const [view, setView] = useState('home') // 'home' or 'detail'
  const [homeData, setHomeData] = useState({ newReleases: [], popular: [], series: [], anime: [], topRated: [] })
  const [homeLoading, setHomeLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryMovies, setCategoryMovies] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY
  const CURRENT_YEAR = new Date().getFullYear()

  // Fetch a single movie by title
  const fetchMovieSummary = async (title) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
      const data = await response.json()
      if (data.Response === 'True') return data
    } catch (err) {}
    return null
  }

  // Fetch a single movie by IMDB id
  const fetchById = async (id) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
      const data = await response.json()
      if (data.Response === 'True') return data
    } catch (err) {}
    return null
  }

  // Dynamic discovery: search OMDB by year to find new movies/series automatically
  const discoverByYear = async (year, type = 'movie', max = 8) => {
    const results = []
    const seenIds = new Set()
    for (const term of DISCOVERY_TERMS) {
      if (results.length >= max) break
      try {
        const res = await fetch(`https://www.omdbapi.com/?s=${term}&y=${year}&type=${type}&apikey=${API_KEY}`)
        const data = await res.json()
        if (data.Search) {
          for (const item of data.Search) {
            if (!seenIds.has(item.imdbID) && results.length < max) {
              seenIds.add(item.imdbID)
              const detail = await fetchById(item.imdbID)
              if (detail) results.push(detail)
            }
          }
        }
      } catch {}
    }
    return results
  }

  // Cache helper: store/retrieve from localStorage with 24h expiry
  const CACHE_KEY = 'allscore_home_cache'
  const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

  const getCachedData = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return null
      const { data, ts } = JSON.parse(raw)
      if (Date.now() - ts < CACHE_TTL) return data
    } catch {}
    return null
  }

  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
    } catch {}
  }

  // Load home page data (cached + dynamic)
  useEffect(() => {
    const loadHomeData = async () => {
      setHomeLoading(true)

      // Try cache first
      const cached = getCachedData()
      if (cached) {
        setHomeData(cached)
        setHomeLoading(false)
        return
      }

      // Fetch all sections in parallel
      const [newReleases, discovered, series, anime, topRated] = await Promise.all([
        Promise.all(NEW_RELEASES_2026.map(fetchMovieSummary)),
        discoverByYear(CURRENT_YEAR, 'movie', 8),
        Promise.all(TRENDING_SERIES_2026.map(fetchMovieSummary)),
        Promise.all(TRENDING_ANIME.map(fetchMovieSummary)),
        Promise.all(TOP_RATED_MOVIES.map(fetchMovieSummary)),
      ])

      // Merge curated + discovered, deduplicate
      const curatedIds = new Set(newReleases.filter(Boolean).map(m => m.imdbID))
      const extraDiscovered = discovered.filter(m => !curatedIds.has(m.imdbID))
      const mergedPopular = [...extraDiscovered]

      const result = {
        newReleases: newReleases.filter(Boolean),
        popular: mergedPopular.length > 0 ? mergedPopular : discovered,
        series: series.filter(Boolean),
        anime: anime.filter(Boolean),
        topRated: topRated.filter(Boolean),
      }

      setCachedData(result)
      setHomeData(result)
      setHomeLoading(false)
    }
    loadHomeData()
  }, [])

  // Translate text to English using MyMemory API (free)
  const translateToEnglish = async (text) => {
    const sourceLangs = ['pt', 'es', 'fr', 'de', 'it', 'ja']
    for (const src of sourceLangs) {
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|en`)
        const data = await res.json()
        if (data.responseStatus === 200 && data.responseData.translatedText) {
          const translated = data.responseData.translatedText
          if (translated.toLowerCase() !== text.toLowerCase()) return translated
        }
      } catch {}
    }
    return null
  }

  const fetchMovieDetails = async (titleOrId, isId = false) => {
    setLoading(true)
    setError('')
    setShowSuggestions(false)
    setSeasons([])
    setIsPlotExpanded(false)
    
    try {
      const param = isId ? `i=${titleOrId}` : `t=${encodeURIComponent(titleOrId)}`
      const url = `https://www.omdbapi.com/?${param}&apikey=${API_KEY}&plot=full`
      const response = await fetch(url)
      let data = await response.json()
      
      // If not found and not an ID search, try translating to English
      if (data.Response !== 'True' && !isId) {
        const translated = await translateToEnglish(titleOrId)
        if (translated) {
          const url2 = `https://www.omdbapi.com/?t=${encodeURIComponent(translated)}&apikey=${API_KEY}&plot=full`
          const res2 = await fetch(url2)
          data = await res2.json()
        }
      }
      if (data.Response === 'True') {
        const criticsStr = data.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value || 'N/A'
        const criticsVal = parseInt(criticsStr)

        let tmdbId = null
        // Try to fetch worldwide Box Office from TMDB
        if (TMDB_API_KEY && data.imdbID) {
          try {
            const findRes = await fetch(`https://api.themoviedb.org/3/find/${data.imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`)
            const findData = await findRes.json()
            if (data.Type === 'movie' && findData.movie_results && findData.movie_results.length > 0) {
              tmdbId = findData.movie_results[0].id
              const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`)
              const movieData = await movieRes.json()
              if (movieData.revenue && movieData.revenue > 0) {
                // Format revenue to currency string e.g. $123,456,789
                data.BoxOffice = "$" + movieData.revenue.toLocaleString('en-US')
              }
            } else if (data.Type === 'series' && findData.tv_results && findData.tv_results.length > 0) {
              tmdbId = findData.tv_results[0].id
            }
          } catch (e) {
            console.error('TMDB Error', e)
          }
        }

        const officialTomato = <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" className="rt-icon-small" style={{ width: '20px', height: '20px', marginRight: '6px' }} />
        
        let criticsIcon = officialTomato
        if (criticsStr === 'N/A') criticsIcon = null

        const ratings = [
          { 
            source: "IMDb", 
            value: data.imdbRating !== 'N/A' ? data.imdbRating : 'N/A', 
            label: "/10",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg",
            link: `https://www.imdb.com/title/${data.imdbID}`,
            class: "score-imdb" 
          },
          { 
            source: "Rotten Tomatoes", 
            isRotten: true,
            critics: criticsStr,
            criticsIcon: criticsIcon,
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg",
            link: `https://www.rottentomatoes.com/${data.Type === 'series' ? 'tv' : 'm'}/${data.Title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
            class: "score-rotten" 
          },
          { 
            source: "Metacritic", 
            value: data.Metascore !== 'N/A' ? data.Metascore : 'N/A',
            label: "/100",
            logo: null,
            fallbackLogo: "M",
            link: `https://www.metacritic.com/search/${encodeURIComponent(data.Title)}/`,
            class: "score-metacritic" 
          },
          { 
            source: "Letterboxd", 
            value: data.imdbRating !== 'N/A' ? (parseFloat(data.imdbRating)/2).toFixed(1) : 'N/A',
            label: "/5",
            logo: "https://a.ltrbxd.com/logos/letterboxd-logo-h-neg-rgb.svg",
            link: `https://letterboxd.com/search/${encodeURIComponent(data.Title)}/`,
            class: "score-letterboxd"
          }
        ]

        let similar = []
        if (RAPID_API_KEY && data.imdbID) {
          try {
            const simRes = await fetch(`https://imdb236.p.rapidapi.com/api/imdb/${data.imdbID}/similar`, {
              headers: {
                'x-rapidapi-host': 'imdb236.p.rapidapi.com',
                'x-rapidapi-key': RAPID_API_KEY
              }
            })
            const simData = await simRes.json()
            if (Array.isArray(simData)) {
              similar = simData.slice(0, 8)
            }
          } catch (e) {
            console.error('Similar API Error', e)
          }
        }

        setMovie({ ...data, customRatings: ratings, similarTitles: similar })
        setSearchTerm(data.Title)
        setView('detail')

        if (data.Type === 'series') {
          fetchAllSeasons(data.imdbID, data.totalSeasons || 1, tmdbId)
        }
      } else {
        setError(t.notFound)
      }
    } catch (err) {
      setError(t.apiError)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSeasons = async (id, totalSeasonsStr) => {
    setLoadingEpisodes(true)
    const totalSeasons = parseInt(totalSeasonsStr)
    if (isNaN(totalSeasons) || totalSeasons <= 0) {
      setSeasons([])
      setLoadingEpisodes(false)
      return
    }

    try {
      const promises = []
      for (let i = 1; i <= totalSeasons; i++) {
        promises.push(fetch(`https://www.omdbapi.com/?i=${id}&Season=${i}&apikey=${API_KEY}`).then(r => r.json()))
      }
      const results = await Promise.all(promises)
      const allSeasons = []
      
      for (const [index, data] of results.entries()) {
        if (data.Response === 'True') {
          const episodes = data.Episodes || []
          
          if (RAPID_API_KEY) {
            const patchPromises = episodes.map(async (ep) => {
              if (ep.imdbRating === 'N/A' && ep.imdbID && ep.imdbID !== 'N/A') {
                try {
                  const rRes = await fetch(`https://imdb236.p.rapidapi.com/api/imdb/${ep.imdbID}/rating`, {
                    headers: {
                      'x-rapidapi-host': 'imdb236.p.rapidapi.com',
                      'x-rapidapi-key': RAPID_API_KEY
                    }
                  })
                  const rData = await rRes.json()
                  if (rData.averageRating) {
                    ep.imdbRating = rData.averageRating.toFixed(1)
                  }
                } catch (e) {
                  // Ignore silently, keeps 'N/A'
                }
              }
              return ep
            })
            await Promise.all(patchPromises)
          }

          allSeasons.push({
            seasonNum: index + 1,
            episodes: episodes
          })
        }
      }
      
      setSeasons(allSeasons)
    } catch (err) {
      console.error('Erro ao buscar episódios:', err)
    } finally {
      setLoadingEpisodes(false)
    }
  }


  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`)
      let data = await response.json()
      
      if (data.Response !== 'True') {
        const translated = await translateToEnglish(query)
        if (translated) {
          const res2 = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(translated)}&apikey=${API_KEY}`)
          data = await res2.json()
        }
      }
      
      if (data.Response === 'True') {
        setSuggestions(data.Search.slice(0, 5))
        setShowSuggestions(true)
      } else {
        setSuggestions([])
      }
    } catch (err) {}
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm && !loading) fetchSuggestions(searchTerm)
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-wrapper')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getRatingColor = (rating) => {
    const val = parseFloat(rating)
    if (isNaN(val)) return 'rgba(255,255,255,0.1)'
    if (val >= 8.5) return '#4ade80'
    if (val >= 7.5) return '#84cc16'
    if (val >= 6.0) return '#eab308'
    return '#ef4444'
  }

  const goHome = () => {
    setView('home')
    setMovie(null)
    setSearchTerm('')
    setError('')
    setSelectedCategory(null)
    setCategoryMovies([])
  }

  const openCategory = async (cat) => {
    setSelectedCategory(cat)
    setCategoryLoading(true)
    setCategoryMovies([])
    const results = await Promise.all(cat.query.map(fetchMovieSummary))
    setCategoryMovies(results.filter(Boolean))
    setCategoryLoading(false)
  }

  // Scroll helper for horizontal rows
  const scrollRow = (ref, direction) => {
    if (ref.current) {
      const amount = direction === 'left' ? -340 : 340
      ref.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  const newReleasesRef = useRef(null)
  const popularRef = useRef(null)
  const seriesRef = useRef(null)
  const animeRef = useRef(null)
  const topRatedRef = useRef(null)

  // Movie card component
  const MovieCard = ({ data, size = 'normal' }) => {
    if (!data) return null
    const imdbRating = data.imdbRating !== 'N/A' ? data.imdbRating : null
    const rtRating = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || null
    const metascore = data.Metascore !== 'N/A' ? data.Metascore : null

    return (
      <div 
        className={`movie-card ${size}`}
        onClick={() => fetchMovieDetails(data.imdbID, true)}
      >
        <div className="movie-card-poster">
          <img src={data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster'} alt={data.Title} />
          <div className="movie-card-overlay">
            <Play size={32} fill="white" />
          </div>
        </div>
        <div className="movie-card-info">
          <h4>{data.Title}</h4>
          <span className="movie-card-year">{data.Year}</span>
          <div className="movie-card-scores">
            {imdbRating && (
              <span className="mini-score imdb">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="mini-logo" />
                {imdbRating}
              </span>
            )}
            {rtRating && (
              <span className="mini-score rt">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="RT" className="mini-logo" />
                {rtRating}
              </span>
            )}
            {metascore && (
              <span className="mini-score mc">
                <span className="mini-mc-box">M</span>
                {metascore}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Scrollable row component
  const MovieRow = ({ title, icon: Icon, movies, scrollRef, accentColor }) => (
    <section className="movie-row-section">
      <div className="row-header">
        <div className="row-title">
          <Icon size={22} style={{ color: accentColor }} />
          <h3>{title}</h3>
        </div>
        <div className="row-controls">
          <button className="scroll-btn" onClick={() => scrollRow(scrollRef, 'left')}>
            <ChevronLeft size={20} />
          </button>
          <button className="scroll-btn" onClick={() => scrollRow(scrollRef, 'right')}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="movie-row" ref={scrollRef}>
        {movies.map((m, i) => (
          <MovieCard key={m.imdbID || i} data={m} />
        ))}
      </div>
    </section>
  )

  // --- RENDER ---

  // Detail view
  if (view === 'detail' && (movie || loading)) {
    return (
      <div className="container">
        <header>
          <div className="header-left">
            <button className="back-btn" onClick={goHome}>
              <ArrowLeft size={20} />
            </button>
            <div className="logo-area" onClick={goHome} style={{ cursor: 'pointer' }}>
              <Film className="logo-icon" size={28} />
              <h1>AllScore</h1>
            </div>
          </div>
          <div className="search-wrapper">
            <form className="search-container" onSubmit={(e) => { e.preventDefault(); fetchMovieDetails(searchTerm) }}>
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="search-input" 
                placeholder={t.placeholder} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
            </form>
            <button className="lang-toggle" onClick={() => { const i = LANG_ORDER.indexOf(lang); setLang(LANG_ORDER[(i + 1) % LANG_ORDER.length]) }}>
              <Globe size={18} />
              <span>{lang === 'pt-BR' ? 'PT' : lang === 'es' ? 'ES' : 'EN'}</span>
            </button>
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-list">
                {suggestions.map((sug) => (
                  <div 
                    key={sug.imdbID} 
                    className="suggestion-item" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      fetchMovieDetails(sug.imdbID, true);
                    }}
                  >
                    <img src={sug.Poster !== 'N/A' ? sug.Poster : 'https://via.placeholder.com/40x60'} alt="" />
                    <div className="suggestion-info">
                      <span className="suggestion-title">{sug.Title}</span>
                      <span className="suggestion-year">{sug.Year}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="movie-display">
          {loading ? (
            <div className="status-message">
              <Loader2 className="animate-spin" size={48} />
              <p>{t.loading}</p>
            </div>
          ) : movie && (
            <div className="featured-movie">
              <div className="poster-container">
                <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/350x500'} alt={movie.Title} />
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer official')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="trailer-btn"
                  >
                    <Play size={20} fill="currentColor" /> {t.watchTrailer}
                  </a>
              </div>
              
              <div className="movie-info">
                <div className="title-section">
                  <h2>{movie.Title}</h2>
                  <span className="original-title">{movie.Title}</span>
                </div>
                
                <div className="movie-meta">
                  <span>{movie.Year}</span>
                  <span>•</span>
                  <span className="type-badge">{movie.Type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{movie.Runtime}</span>
                  {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                    <>
                      <span>•</span>
                      <span className="box-office" style={{ color: '#4ade80', fontWeight: '600' }}>💵 {movie.BoxOffice}</span>
                    </>
                  )}
                </div>
                
                <div className={`plot-container ${isPlotExpanded ? 'expanded' : ''}`}>
                  <p className="plot">{movie.Plot}</p>
                  {movie.Plot.length > 150 && (
                    <button className="expand-btn" onClick={() => setIsPlotExpanded(!isPlotExpanded)}>
                      {isPlotExpanded ? <><ChevronUp size={16} /> {t.seeLess}</> : <><ChevronDown size={16} /> {t.seeMore}</>}
                    </button>
                  )}
                </div>
                
                <div className="scores-grid">
                  {movie.customRatings.map((rating, index) => (
                    <a 
                      key={index} 
                      href={rating.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`score-card ${rating.class}`}
                    >
                      <div className="score-header">
                        {rating.source === 'Metacritic' ? (
                          <div className="mc-box">{rating.fallbackLogo}</div>
                        ) : (
                          <img src={rating.logo} alt={rating.source} className="brand-logo" />
                        )}
                      </div>
                      <div className="score-main">
                        {rating.isRotten ? (
                          <div className="rotten-combined" style={{ justifyContent: 'center' }}>
                            <div className="rotten-sub">
                              <div className="rotten-val-row">
                                {rating.criticsIcon}
                                <span className="score-value">{rating.critics}</span>
                              </div>
                              <span className="score-subtext">{t.critics}</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="score-value">{rating.value}</span>
                            <span className="score-subtext">{rating.label}</span>
                          </>
                        )}
                      </div>
                    </a>
                  ))}
                </div>

                {movie.Type === 'series' && (
                  <div className="episodes-section">
                    <h3><Tv size={20} /> {t.seasonEpisodes}</h3>
                    <div className="all-seasons">
                      {loadingEpisodes ? (
                        <p>{t.loadingEpisodes}</p>
                      ) : seasons.map((season) => (
                        <div key={season.seasonNum} className="season-container" style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>Temporada {season.seasonNum}</h4>
                          <div className="episodes-grid">
                            {season.episodes.map((ep, idx) => (
                              <a 
                                key={idx} 
                                className="episode-box" 
                                href={`https://www.imdb.com/title/${ep.imdbID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ backgroundColor: getRatingColor(ep.imdbRating) }}
                                title={`E${ep.Episode}: ${ep.Title} (${ep.imdbRating}) — Abrir no IMDb`}
                              >
                                {ep.imdbRating !== 'N/A' ? ep.imdbRating : '?'}
                                <span className="ep-num">E{ep.Episode}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {movie.similarTitles && movie.similarTitles.length > 0 && (
                  <div className="episodes-section" style={{ marginTop: '2rem' }}>
                    <h3><Film size={20} /> {t.similarTitles}</h3>
                    <div className="movie-grid">
                      {movie.similarTitles.map((sim) => (
                        <div key={sim.id} className="movie-card" onClick={() => fetchMovieDetails(sim.id)}>
                          <div className="poster-container">
                            <img src={sim.primaryImage !== 'N/A' ? sim.primaryImage : 'https://via.placeholder.com/300x450?text=No+Poster'} alt={sim.primaryTitle} />
                            <div className="card-overlay">
                              <span className="rating"><Star size={14} /> {sim.averageRating || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="card-info">
                            <h4>{sim.primaryTitle}</h4>
                            <p className="year">{sim.startYear}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="status-message error">
              <AlertCircle size={48} />
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Home view
  return (
    <div className="container home-view">
      <header className="home-header">
        <div className="header-left">
          <div className="logo-area">
            <Film className="logo-icon" size={28} />
            <h1>AllScore</h1>
          </div>
        </div>
        <button className="lang-toggle" onClick={() => { const i = LANG_ORDER.indexOf(lang); setLang(LANG_ORDER[(i + 1) % LANG_ORDER.length]) }}>
          <Globe size={18} />
          <span>{lang === 'pt-BR' ? 'PT' : lang === 'es' ? 'ES' : 'EN'}</span>
        </button>
      </header>

      {/* Hero Section with centered search */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <h2 className="hero-title">{t.heroTitle}</h2>
        <p className="hero-subtitle">{t.heroSubtitle}</p>
        <div className="hero-search-wrapper">
          <form className="search-container hero-search" onSubmit={(e) => { e.preventDefault(); fetchMovieDetails(searchTerm) }}>
            <Search className="search-icon" size={22} />
            <input 
              type="text" 
              className="search-input" 
              placeholder={t.placeholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((sug) => (
                <div 
                  key={sug.imdbID} 
                  className="suggestion-item" 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    fetchMovieDetails(sug.imdbID, true);
                  }}
                >
                  <img src={sug.Poster !== 'N/A' ? sug.Poster : 'https://via.placeholder.com/40x60'} alt="" />
                  <div className="suggestion-info">
                    <span className="suggestion-title">{sug.Title}</span>
                    <span className="suggestion-year">{sug.Year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-title-row">
          <h3><Award size={22} style={{ color: '#3b82f6' }} /> {t.categories}</h3>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button 
                key={cat.id} 
                className={`category-card ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                onClick={() => openCategory(cat)}
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon">
                  <Icon size={24} />
                </div>
                <span>{cat.label[lang]}</span>
              </button>
            )
          })}
        </div>

        {/* Category results */}
        {selectedCategory && (
          <div className="category-results">
            <h4 style={{ color: selectedCategory.color }}>{selectedCategory.label[lang]}</h4>
            {categoryLoading ? (
              <div className="status-message small">
                <Loader2 className="animate-spin" size={28} />
              </div>
            ) : (
              <div className="category-movies-grid">
                {categoryMovies.map((m, i) => (
                  <MovieCard key={m.imdbID || i} data={m} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Loading state for home */}
      {homeLoading ? (
        <div className="status-message">
          <Loader2 className="animate-spin" size={48} />
          <p>{t.loading}</p>
        </div>
      ) : (
        <>
          {/* New Releases */}
          <MovieRow 
            title={t.newReleases} 
            icon={Sparkles} 
            movies={homeData.newReleases} 
            scrollRef={newReleasesRef}
            accentColor="#3b82f6"
          />

          {/* Popular */}
          <MovieRow 
            title={t.popular} 
            icon={Flame} 
            movies={homeData.popular} 
            scrollRef={popularRef}
            accentColor="#f59e0b"
          />

          {/* Series */}
          <MovieRow 
            title={t.newSeries} 
            icon={MonitorPlay} 
            movies={homeData.series} 
            scrollRef={seriesRef}
            accentColor="#8b5cf6"
          />

          {/* Anime */}
          <MovieRow 
            title={t.newAnime} 
            icon={Popcorn} 
            movies={homeData.anime} 
            scrollRef={animeRef}
            accentColor="#ec4899"
          />

          {/* Top Rated */}
          <MovieRow 
            title={t.topRated} 
            icon={Star} 
            movies={homeData.topRated} 
            scrollRef={topRatedRef}
            accentColor="#4ade80"
          />
        </>
      )}

      {error && (
        <div className="status-message error">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default App
