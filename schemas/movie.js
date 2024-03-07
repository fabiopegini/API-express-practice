const z = require('zod')

const movieSchema = z.object({
	title: z.string({
		invalid_type_error: 'Movie title must be a string',
		required_error: 'Tilte is required',
	}),
	year: z.number().int().min(1900).max(2024),
	director: z.string(),
	duration: z.number().int().positive(),
	rate: z.number().min(0).max(10).default(0),
	poster: z.string().url({
		message: 'Poster must be a valid URL',
	}),
	genre: z.array(
		z.enum([
			'Action',
			'Drama',
			'Crime',
			'Adventure',
			'Sci-Fi',
			'Romance',
			'Animation',
			'Biography',
			'Fantasy',
		]),
		{
			required_error: 'Genre is required',
			invalid_type_error: 'Genre must be of type enum genre',
		},
	),
})

function validateMovie(input) {
	return movieSchema.safeParse(input)
}

function partiallyValidateMovie(input) {
	return movieSchema.partial().safeParse(input)
}

module.exports = {
	validateMovie,
	partiallyValidateMovie,
}
