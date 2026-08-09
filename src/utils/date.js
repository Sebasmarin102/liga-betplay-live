export function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export function formatMatchTime(strTimestamp) {
    const date = new Date(strTimestamp + 'Z')
    return date.toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
}

export function formatMatchDate(strTimestamp) {
  const date = new Date(strTimestamp + 'Z')
  return date.toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: 'numeric',
    month: 'short'
  })
}

export function calculateAge(dateBornStr) {
  if (!dateBornStr) return null

  const birthDate = new Date(dateBornStr)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()

  const yaCumplioEsteAño =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  if (!yaCumplioEsteAño) {
    age--
  }

  return age
}