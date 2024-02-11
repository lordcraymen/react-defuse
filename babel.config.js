module.exports = function(api) {
	// Correctly configure caching once, before other operations
	api.cache(true)
  
	// Directly determine if the environment is 'test' without calling api.env() inside a conditional logic
	const isTest = process.env.NODE_ENV === "test"
  
	return {
		presets: [
			"@babel/preset-env",
			"@babel/preset-react",
			// Apply TypeScript preset only for Jest tests
			isTest ? "@babel/preset-typescript" : null,
		].filter(Boolean), // Filter to remove any nullish presets
	}
}
  
  