
import httpService from '../services/httpService.js'
import API_CONFIG from '../config/api.js'
import storageService from '../services/storageService.js'

class AuthModel {
  // Iniciar sesión
  static async login(credentials) {
    try {
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          email: credentials.email,
          password: credentials.password
        },
        false
      )

      if (!response || !response.success) {
        return {
          success: false,
          error: response?.message || 'Error en el servidor'
        }
      }

      const userDataFromApi = response.data

      if (!userDataFromApi) {
        return {
          success: false,
          error: 'No se recibieron los datos del usuario'
        }
      }

      const sessionToken = userDataFromApi.session_token

      if (!sessionToken) {
        return {
          success: false,
          error: 'No se encontró el token de autenticación'
        }
      }

      const token = sessionToken.replace(/^JWT\s+/i, '')

      const userData = {
        id: userDataFromApi.id,
        email: userDataFromApi.email,
        name: userDataFromApi.name,
        lastname: userDataFromApi.lastname,
        role: userDataFromApi.role,
        phone: userDataFromApi.phone,
        image: userDataFromApi.image
      }

      storageService.setToken(token)
      storageService.setUser(userData)
      storageService.setUserRole(userData.role)

      return {
        success: true,
        token,
        user: userData
      }
    } catch (error) {
      console.error('Error durante el login:', error)

      return {
        success: false,
        error: error.message || 'No fue posible iniciar sesión'
      }
    }
  }

  // Comprobar si existe una sesión
  static isAuthenticated() {
    return Boolean(storageService.getToken())
  }

  // Obtener el usuario guardado
  static getCurrentUser() {
    return storageService.getUser()
  }

  // Obtener el token guardado
  static getCurrentToken() {
    return storageService.getToken()
  }

  // Cerrar sesión
  static async logout() {
    try {
      storageService.clearSession()

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: 'No fue posible cerrar la sesión'
      }
    }
  }
}

export default AuthModel
