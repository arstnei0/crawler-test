import { crawlPage } from './crawl.js'
import { printReports } from './report.js'

async function main() {
	if (process.argv.length < 3) {
		console.log('no website provided')
		return
	}
	if (process.argv.length > 3) {
		console.log('too many arguments provided')
		return
	}
	const baseURL = process.argv[2]

	const pages = await crawlPage(baseURL)
	printReports(pages)
}

await main()
