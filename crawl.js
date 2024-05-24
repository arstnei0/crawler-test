import { JSDOM } from 'jsdom'

function normalizeURL(url) {
	const urlObj = new URL(url)
	let fullPath = `${urlObj.host}${urlObj.pathname}`
	if (fullPath.slice(-1) === '/') {
		fullPath = fullPath.slice(0, -1)
	}
	return fullPath
}

function getURLsFromHTML(html, baseURL) {
	const urls = []
	const dom = new JSDOM(html)
	const anchors = dom.window.document.querySelectorAll('a')

	for (const anchor of anchors) {
		if (anchor.hasAttribute('href')) {
			let href = anchor.getAttribute('href')

			try {
				// convert any relative URLs to absolute URLs
				href = new URL(href, baseURL).href
				urls.push(href)
			} catch (err) {
				console.log(`${err.message}: ${href}`)
			}
		}
	}

	return urls
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
	if (new URL(currentURL).hostname !== new URL(baseURL).hostname) {
		return pages
	}

	const normalizedURL = normalizeURL(currentURL)
	if (Reflect.has(pages, normalizedURL)) {
		pages[normalizedURL] += 1
		return pages
	}
	pages[normalizedURL] = 1

	const res = await fetch(baseURL)
	if (res.status >= 400) {
		console.error('Fetch failed')
		return
	}
	if (!res.headers.get('content-type').includes('text/html')) {
		console.error('Not HTML')
		return
	}

	const html = await res.text()
	const urls = getURLsFromHTML(html, currentURL)

	for (const url of urls) {
		await crawlPage(baseURL, url, pages)
	}

	return pages
}

export { normalizeURL, getURLsFromHTML, crawlPage }
