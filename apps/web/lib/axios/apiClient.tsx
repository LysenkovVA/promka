/**
 * Клиент API-запросов
 */
import axios from "axios"
import { toast } from "sonner"
import { ResponseData } from "@/lib/responses/ResponseData"

// Эндпоинт для обновления токена
const REFRESH_TOKEN_URL = "/refresh"
// Эндпоинт для выхода
const LOGOUT_URL = "/logout"
// Эндпоинты, для которых НЕ нужно делать refresh
const NO_REFRESH_URLS = ["/", "/login"]

// Флаг: идёт ли сейчас обновление токена
let isRefreshing = false
// Очередь запросов, которые ждут обновления токена
let failedRequestsQueue: Array<(token: string | null) => void> = []

// Функция для повторения проваленных запросов
const processQueue = (error: any, token: string | null) => {
  failedRequestsQueue.forEach((prom) => prom(token))
  failedRequestsQueue = []
}

// Экспортируем функцию logout
export const logout = async () => {
  try {
    // Отправляем запрос на logout (сервер удалит refresh-токен, например)
    await apiClient.post(
      LOGOUT_URL,
      {},
      {
        withCredentials: true,
      }
    )
  } catch (error) {
    // Игнорируем ошибки logout — пользователь всё равно выходит
    console.warn("Logout request failed, proceeding anyway", error)
  } finally {
    // Очищаем флаги и очередь
    isRefreshing = false
    failedRequestsQueue = []

    // Очистка локального состояния (если используется localStorage)
    // Например:
    // localStorage.removeItem('accessToken')

    // Редирект на страницу входа
    window.location.href = process.env.NEXT_PUBLIC_PATH!
  }
}

// Создаём экземпляр axios
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_PATH || "Error reading env file for axios", // Базовый URL API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ← позволяет отправлять cookies
})

// Интерцептор ответов API (например, обработка ошибок)
apiClient.interceptors.response.use(
  (response) => response,
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
        // Если refresh тоже упал — разлогиниваем
        toast.error("Обновление токена завершилось с ошибкой", {
          position: "top-center",
          style: { color: "tomato" },
        })
        window.location.href = process.env.NEXT_PUBLIC_PATH!
        processQueue(refreshError, null)

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Для других ошибок — показываем тост
    const errorData = error.response?.data as ResponseData<undefined>

    switch (error.response?.status) {
      case 403:
        break
      case 500:
        if (errorData?.errorMessages) {
          toast.error(`${errorData.errorMessages} (axios)`, {
            position: "top-center",
            style: { color: "tomato" },
          })
        } else {
          toast.error("Неизвестная ошибка (axios)", {
            position: "top-center",
            style: { color: "tomato" },
          })
        }
        break
    }

    return Promise.reject(error)
  }
)

export default apiClient
