const DEFAULT_API_URL = 'http://127.0.0.1:8000'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
}

function formatApiErrors(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Nao foi possivel concluir a solicitacao.'
  }

  const messages = Object.entries(payload).flatMap(([field, value]) => {
    const normalizedValues = Array.isArray(value) ? value : [value]

    return normalizedValues.map((message) => {
      if (field === 'detail') {
        return String(message)
      }

      return `${field}: ${String(message)}`
    })
  })

  return messages.join(' ')
}

export async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const text = await response.text()
  let payload = null

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      throw new Error('A API retornou uma resposta invalida.')
    }
  }

  if (!response.ok) {
    throw new Error(formatApiErrors(payload))
  }

  return payload
}

export async function loginWithJwt(credentials) {
  return requestJson(`${getApiBaseUrl()}/api/auth/jwt/create/`, {
    method: 'POST',
    body: JSON.stringify(credentials),
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
