import axios from 'axios'
const API_URL = import.meta.env.VITE_APP_ATOMIC_API

export async function makeRequest({ method, headers, endpoint, data }) {
  const client = axios.create({
    baseURL: API_URL
  })

  client.retries = 0

  let response = _callApi(client, {
    method,
    headers,
    data,
    url: endpoint
  })
  return response
}

async function _callApi(client, { method, headers, data, url }) {
  const publicToken = localStorage.getItem('token')

  return client({
    method,
    data,
    url,
    headers: {
      ['content-type']: 'application/json',
      ...headers,
      ['x-public-token']: publicToken
    }
  }).catch((err) => {
    if (err.response?.data?.code === 40104) {
      localStorage.removeItem('token')
    } else {
      console.log('request error', err)
      throw err
    }
  })
}
