import { getApiBaseUrl, refreshAccessToken } from '@/features/auth/lib/auth-client'

const GENERIC_REQUEST_ERROR = 'Não foi possível concluir a solicitação agora. Tente novamente em instantes.'
let isRefreshing = false
let refreshPromise = null

async function tryRefreshToken() {
  // Se já está fazendo refresh, retorna a promise existente
  if (isRefreshing) {
    return refreshPromise
  }

  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    return null
  }

  isRefreshing = true
  refreshPromise = refreshAccessToken(refreshToken)
    .then((data) => {
      if (data?.access) {
        localStorage.setItem('access_token', data.access)
        return data.access
      }
      return null
    })
    .catch(() => null)
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

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

  // Se recebeu 401 e requer autenticação, tenta refresh
  if (response.status === 401 && requiresAuth) {
    const newToken = await tryRefreshToken()
    
    if (newToken) {
      // Retry da requisição com novo token
      headers.Authorization = `Bearer ${newToken}`
      try {
        response = await fetch(`${getApiBaseUrl()}${path}`, {
          headers,
          ...fetchOptions,
        })
      } catch {
        throw new Error('Não foi possível conectar ao servidor. Tente novamente em instantes.')
      }
    } else {
      // Refresh falhou, limpa tokens e redireciona
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      throw new Error('Sessão expirada. Redirecionando para login...')
    }
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

export async function fetchUserProfile() {
  return requestApi('/api/auth/users/me/', {
    method: 'GET',
    errorMessage: 'Erro ao carregar perfil do usuário.',
  })
}

export async function updateUserProfile(data) {
  return requestApi('/api/auth/users/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
    errorMessage: 'Erro ao atualizar perfil.',
  })
}
