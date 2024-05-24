export function printReports(pages) {
	console.log('Printing Reports')
	const sortedPages = Object.entries(pages).sort((a, b) => b[1] - a[1])

	for (const [url, count] of sortedPages) {
		console.log(`Found ${count} internal links to ${url}`)
	}
}
