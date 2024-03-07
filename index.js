const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, partiallyValidateMovie } = require('./schemas/movie.js')
const cors = require('cors')

const app = express()

app.disable('x-powered-by')

app.use(express.json())

const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:5000']

app.use(
	cors({
		origin: (origin, callback) => {
			if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true)
			if (!origin) return callback(null, true)
			return callback(null, true)
		},
	}),
)

// GETs

app.get('/', (req, res) => {
	res.end('<h1>Welcome to API Movies</h1>')
})

app.get('/movies', (req, res) => {
	const { genre } = req.query
	if (genre) {
		const moviesByGenre = movies.filter((movie) => {
			return movie.genre.some(
				(movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase(),
			)
		})
		return res.json(moviesByGenre)
	}

	res.json(movies)
})

app.get('/movies/:id', (req, res) => {
	const { id } = req.params
	const movie = movies.find((movie) => movie.id === id)
	if (movie) res.json(movie)
	if (!movie) res.end('<h1>404 Resource not Found</h1>')
})

// POSTs

app.post('/movies', (req, res) => {
	const result = validateMovie(req.body)

	if (result.error)
		return res.status(400).json({ error: JSON.parse(result.error.message) })

	const newMovie = {
		id: crypto.randomUUID(),
		...result.data,
	}

	movies.push(newMovie)

	res.status(201).json(newMovie)
})

// PATCHs

app.patch('/movies/:id', (req, res) => {
	const result = partiallyValidateMovie(req.body)

	if (result.error)
		return res.status(400).json({ error: JSON.parse(result.error.message) })

	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1)
		return res.status(404).json({ message: 'Movie not found' })

	const modifiedMovie = {
		...movies[movieIndex],
		...result.data,
	}
	movies[movieIndex] = modifiedMovie

	res.json(modifiedMovie)
})

// DELETEs

app.delete('movies/:id', (req, res) => {
	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1)
		return res.status(404), json({ message: 'Movie not found' })

	movies.splice(movieIndex, 1)

	return res.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
	console.log(`server listening in port ${PORT}`)
})
