const userModel = require("../models/user-model")
const bcrypt = require('bcrypt')
const tokenService = require("./token-service")
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error")

class UserService {
  async registration(email, password) {
    const candidate = await userModel.findOne({email})
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`)
    }
    
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await userModel.create({email, password: hashPassword})

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto}
  }
}

module.exports = new UserService()