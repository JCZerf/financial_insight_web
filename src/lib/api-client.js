import { getApiBaseUrl } from '@/features/auth/lib/auth-client'

const GENERIC_REQUEST_ERROR = 'Não foi possível concluir a solicitação agora. Tente novamente em instantes.'

export async function requestApi(path, options = {}) {
  const {
    errorMessage = GENERIC_REQUEST_ERROR,
    requiresAuth = true,
    ...fetchOptions
  } = options

  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers ?? {}),
  }

  if (requiresAuth) {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
  }

  let response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers,
      ...fetchOptions,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente em instantes.')
  }

  const text = await response.text()
  let payload = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      throw new Error(errorMessage)
    }
  }

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return payload
}

export async function fetchDashboard(filters = {}) {
  const params = new URLSearchParams()
  
  if (filters.segment) params.append('segment', filters.segment)
  if (filters.min_dividend_yield) params.append('min_dividend_yield', filters.min_dividend_yield)
  if (filters.max_price_to_book) params.append('max_price_to_book', filters.max_price_to_book)
  if (filters.min_liquidity) params.append('min_liquidity', filters.min_liquidity)
  if (filters.limit) params.append('limit', filters.limit)

  const queryString = params.toString()
  const path = `/api/dashboard/initial/${queryString ? `?${queryString}` : ''}`

  return requestApi(path, {
    method: 'GET',
    errorMessage: 'Erro ao carregar dados do dashboard.',
  })
}

export async function fetchFundsList(filters = {}) {
  const params = new URLSearchParams()
  
  if (filters.segment) params.append('segment', filters.segment)
  if (filters.min_dividend_yield) params.append('min_dividend_yield', filters.min_dividend_yield)
  if (filters.max_price_to_book) params.append('max_price_to_book', filters.max_price_to_book)
  if (filters.min_liquidity) params.append('min_liquidity', filters.min_liquidity)
  if (filters.limit) params.append('limit', filters.limit)

  const queryString = params.toString()
  const path = `/api/funds/${queryString ? `?${queryString}` : ''}`

  return requestApi(path, {
    method: 'GET',
    errorMessage: 'Erro ao carregar lista de fundos.',
  })
}

export async function fetchFundDetail(ticker) {
  return requestApi(`/api/funds/${ticker}/`, {
    method: 'GET',
    errorMessage: 'Erro ao carregar detalhes do fundo.',
  })
}
