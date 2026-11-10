
import UserModel from '../models/UserModel'

const UserController = {
  // Obtener todos los usuarios
  async getAllUsers(onSuccess, onError) {
    try {
      const result = await UserModel.getAllUsers()

      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al cargar usuarios')
    }
  },

  // Obtener usuario por ID
  async getUserById(id, onSuccess, onError) {
    try {
      const result = await UserModel.getUserById(id)

      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al obtener usuario')
    }
  },

  // Crear usuario
  async createUser(userData, onSuccess, onError) {
    try {
      if (!userData || !userData.email) {
        onError('El email es requerido')
        return
      }

      const result = await UserModel.createUser(userData)

      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al crear usuario')
    }
  },

  // Actualizar usuario
  async updateUser(id, userData, onSuccess, onError) {
    try {
      if (!id || !userData) {
        onError('Datos incompletos')
        return
      }

      const result = await UserModel.updateUser(id, userData)

      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al actualizar usuario')
    }
  },

  // Actualizar campo específico
  async patchUser(id, partialData, onSuccess, onError) {
    try {
      if (!id || !partialData) {
        onError('Datos incompletos')
        return
      }

      const result = await UserModel.patchUser(id, partialData)

      if (result.success) {
        onSuccess(result.data)
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al actualizar campo')
    }
  },

  // Eliminar usuario
  async deleteUser(id, onSuccess, onError) {
    try {
      if (!id) {
        onError('ID de usuario no proporcionado')
        return
      }

      const result = await UserModel.deleteUser(id)

      if (result.success) {
        onSuccess()
      } else {
        onError(result.error)
      }
    } catch (error) {
      console.error(error)
      onError('Error al eliminar usuario')
    }
  }
}

export default UserController
