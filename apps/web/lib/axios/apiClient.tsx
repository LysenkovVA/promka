/**
 * Клиент API-запросов
 */
import axios from "axios"

// Эндпоинт для обновления токена
const REFRESH_TOKEN_URL = "/refresh"

// Флаг: идёт ли сейчас обновление токена
let isRefreshing = false
// Очередь запросов, которые ждут обновления токена
let failedRequestsQueue: Array<(token: string | null) => void> = []

// Функция для повторения проваленных запросов
const processQueue = (error: any, token: string | null) => {
  failedRequestsQueue.forEach((prom) => prom(token))
  failedRequestsQueue = []
}

// Создаём экземпляр axios
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_PATH || "Error reading env file for axios", // Базовый URL API
  timeout: 10000,
  headers: {
    /* Content-Type устанавливается автоматически браузером для FormData,
       а для JSON-запросов задаётся явно в опциях каждого запроса */
  },
  withCredentials: true, // ← позволяет отправлять cookies
})

// Интерцептор ответов API (например, обработка ошибок)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Оригинальный запрос
    const originalRequest = error.config

    // Если ошибка 401 и нет флага retry — пробуем обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Устанавливаем флаг, чтобы не делать несколько refresh'ей
      if (isRefreshing) {
        // Ставим запрос в очередь
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push((token) => {
            if (!token) {
              return reject(error)
            }

            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Отправляем запрос на обновление токена
        const response = await axios.post(
          `${apiClient.defaults.baseURL}${REFRESH_TOKEN_URL}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // ← позволяет отправлять cookies
          }
        )

        const newAccessToken = response.data.data

        // Разрешаем все запросы в очереди
        processQueue(null, newAccessToken)

        // Повторяем оригинальный запрос
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
