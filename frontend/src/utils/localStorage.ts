export function storeData(
  key: string,
  value: string
): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error storing data: ', error)
  }
}

export function getData(
  key: string
): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error retrieving data: ', error)
    return null
  }
}

export function removeData(
  key: string
): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing data: ', error)
  }
}