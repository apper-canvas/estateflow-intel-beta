import propertyData from '../mockData/property.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const propertyService = {
  async getAll() {
    await delay(300)
    return [...propertyData]
  },

  async getById(id) {
    await delay(200)
    const property = propertyData.find(item => item.id === id)
    if (!property) {
      throw new Error('Property not found')
    }
    return { ...property }
  },

  async create(propertyData) {
    await delay(400)
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      listingDate: new Date().toISOString()
    }
    return { ...newProperty }
  },

  async update(id, updates) {
    await delay(350)
    const propertyIndex = propertyData.findIndex(item => item.id === id)
    if (propertyIndex === -1) {
      throw new Error('Property not found')
    }
    
    const updatedProperty = {
      ...propertyData[propertyIndex],
      ...updates
    }
    
    return { ...updatedProperty }
  },

  async delete(id) {
    await delay(250)
    const propertyIndex = propertyData.findIndex(item => item.id === id)
    if (propertyIndex === -1) {
      throw new Error('Property not found')
    }
    
    return { success: true, id }
  }
}

export default propertyService