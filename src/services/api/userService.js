import userData from '../mockData/user.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const userService = {
  async getAll() {
    await delay(300)
    return [...userData]
  },

  async getById(id) {
    await delay(200)
    const user = userData.find(item => item.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      savedProperties: [],
      savedSearches: [],
      viewingHistory: [],
      preferences: {}
    }
    return { ...newUser }
  },

  async update(id, updates) {
    await delay(350)
    const userIndex = userData.findIndex(item => item.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    const updatedUser = {
      ...userData[userIndex],
      ...updates
    }
    
    return { ...updatedUser }
  },

  async delete(id) {
    await delay(250)
    const userIndex = userData.findIndex(item => item.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    return { success: true, id }
  }
}

export default userService