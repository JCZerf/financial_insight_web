export function normalizeCpf(value) {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function formatCpf(value) {
  const digits = normalizeCpf(value)

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function normalizeBirthDate(value) {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatBirthDate(value) {
  const digits = normalizeBirthDate(value)

  return digits
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
}

export function birthDateToApiDate(value) {
  const digits = normalizeBirthDate(value)

  if (digits.length !== 8) {
    return ''
  }

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  return `${year}-${month}-${day}`
}

export function isValidCpf(value) {
  const digits = normalizeCpf(value)

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false
  }

  let sum = 0

  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index)
  }

  let firstVerifier = (sum * 10) % 11

  if (firstVerifier === 10) {
    firstVerifier = 0
  }

  if (firstVerifier !== Number(digits[9])) {
    return false
  }

  sum = 0

  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index)
  }

  let secondVerifier = (sum * 10) % 11

  if (secondVerifier === 10) {
    secondVerifier = 0
  }

  return secondVerifier === Number(digits[10])
}

function getAgeFromBirthDate(value) {
  const apiDate = birthDateToApiDate(value)
  const birthDate = new Date(`${apiDate}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1
  }

  return age
}

function isValidBirthDate(value) {
  const apiDate = birthDateToApiDate(value)

  if (!apiDate) {
    return false
  }

  const [year, month, day] = apiDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function validateRegisterForm(values) {
  const trimmedName = values.name.trim().replace(/\s+/g, ' ')
  const normalizedEmail = values.email.trim().toLowerCase()
  const normalizedCpf = normalizeCpf(values.cpf)

  if (!normalizedEmail) {
    return 'Informe um email.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Informe um email valido.'
  }

  if (!trimmedName || trimmedName.length < 2) {
    return 'Informe um nome completo valido.'
  }

  if ((trimmedName.match(/[A-Za-zÀ-ÿ]/g) ?? []).length < 2) {
    return 'O nome precisa ter pelo menos 2 letras.'
  }

  if (!values.birthDate) {
    return 'Informe a data de nascimento.'
  }

  if (!isValidBirthDate(values.birthDate)) {
    return 'Informe uma data de nascimento valida no formato dd/mm/aaaa.'
  }

  const age = getAgeFromBirthDate(values.birthDate)

  if (age < 18 || age > 120) {
    return 'A idade permitida para cadastro deve estar entre 18 e 120 anos.'
  }

  if (!isValidCpf(normalizedCpf)) {
    return 'Informe um CPF valido.'
  }

  if (!values.password) {
    return 'Informe uma senha.'
  }

  if (values.password !== values.confirmPassword) {
    return 'A confirmacao de senha precisa ser igual a senha.'
  }

  return ''
}

export function validateLoginForm(values) {
  const normalizedEmail = values.email.trim().toLowerCase()

  if (!normalizedEmail) {
    return 'Informe seu email.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Informe um email valido.'
  }

  if (!values.password) {
    return 'Informe sua senha.'
  }

  return ''
}
