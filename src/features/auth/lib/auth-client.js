const DEFAULT_API_URL = 'http://127.0.0.1:8000'
const GENERIC_REQUEST_ERROR = 'Nao foi possivel concluir a solicitacao agora. Tente novamente em instantes.'
const LOGIN_ERROR = 'Email ou senha incorretos. Confira os dados e tente novamente.'

export function getApiBaseUrl() {
  if (import.meta.env.DEV) {
    return ''
  }

  return import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
}

function translateApiMessage(message) {
  const normalizedMessage = String(message).toLowerCase()

  if (
    normalizedMessage.includes('no active account') ||
    normalizedMessage.includes('credentials') ||
    normalizedMessage.includes('unable to log in')
  ) {
    return LOGIN_ERROR
  }

  if (normalizedMessage.includes('already exists') || normalizedMessage.includes('already been used')) {
    return 'Ja existe uma conta cadastrada com esses dados.'
  }

  if (normalizedMessage.includes('valid email')) {
    return 'Informe um email valido.'
  }

  if (normalizedMessage.includes('blank') || normalizedMessage.includes('required')) {
    return 'Preencha todos os campos obrigatorios.'
  }

  if (normalizedMessage.includes('password')) {
    return 'A senha informada nao atende aos criterios exigidos.'
  }

  return GENERIC_REQUEST_ERROR
}

function formatApiErrors(payload, fallbackMessage = GENERIC_REQUEST_ERROR) {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage
  }

  const messages = Object.values(payload).flatMap((value) => {
    const normalizedValues = Array.isArray(value) ? value : [value]

    return normalizedValues.map(translateApiMessage)
  })

  return [...new Set(messages)].join(' ') || fallbackMessage
}

export async function requestJson(path, options = {}) {
  const {
    errorMessage = GENERIC_REQUEST_ERROR,
    ...fetchOptions
  } = options
  let response

  try {
    response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers ?? {}),
      },
      ...fetchOptions,
    })
  } catch {
    throw new Error('Nao foi possivel conectar ao servidor. Tente novamente em instantes.')
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
    throw new Error(formatApiErrors(payload, errorMessage))
  }

  return payload
}

export async function loginWithJwt(credentials) {
  return requestJson(`${getApiBaseUrl()}/api/auth/jwt/create/`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    errorMessage: LOGIN_ERROR,
  })
}

export async function refreshAccessToken(refreshToken) {
  return requestJson(`${getApiBaseUrl()}/api/auth/jwt/refresh/`, {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
    errorMessage: 'Não foi possível renovar a sessão.',
  })
}

export async function fetchAuthenticatedUser(accessToken) {
  return requestJson(`${getApiBaseUrl()}/api/auth/users/me/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function registerUser(payload) {
  return requestJson(`${getApiBaseUrl()}/api/auth/users/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function persistAuthTokens({ access, refresh }) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function hasStoredAuthTokens() {
  return Boolean(localStorage.getItem('access_token'))
}
