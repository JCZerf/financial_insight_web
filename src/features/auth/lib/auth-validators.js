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
  const birthDate = new Date(`${value}T00:00:00`)
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

export function validateRegisterForm(values) {
  const trimmedName = values.name.trim().replace(/\s+/g, ' ')
  const normalizedEmail = values.email.trim().toLowerCase()
  const normalizedCpf = normalizeCpf(values.cpf)

  if (!normalizedEmail) {
    return 'Informe um email.'
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
