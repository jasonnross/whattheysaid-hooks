export function encodeObject(object) {
	if (!object) return '';
	const keys = Object.keys(object);
	return '?' + keys.map((key) => {
		return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
	}).join('&');
}

export default async function apiRequest({ endpoint, parameters, body, method }) {
  let requestUrl = `${process.env.REACT_APP_API_BASE_URL}/${endpoint}${encodeObject(parameters)}`;
	console.log('Hitting API with: ', requestUrl);
  let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${endpoint}${encodeObject(parameters)}`, { method, body: body ? JSON.stringify(body) : undefined });
	let data = await response.json();
	return data;
}