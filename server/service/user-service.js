const userModel = require("../models/user-model")
const bcrypt = require('bcrypt')
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

const createTokens = async (user) => {
  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({...userDto})
  await tokenService.saveToken(userDto.id, tokens.refreshToken)

  return {...tokens, user: userDto}
}

class UserService {
  async registration(email, password) {
    const candidate = await userModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`)
    }
    
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await userModel.create({email, password: hashPassword})

    return await createTokens(user)
  }
  
  async login(email, password) {
    const user = await userModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('User with this email was not found')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password is not correct')
    }

    return await createTokens(user)
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnathorizedError()
    }

    const user = await userModel.findById(userData.id)
    return await createTokens(user)
  }

  async getAllUsers() {
    const users = await userModel.find()
    return users
  }
}

module.exports = new UserService()