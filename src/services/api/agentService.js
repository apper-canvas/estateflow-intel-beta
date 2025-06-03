import agentData from '../mockData/agent.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const agentService = {
  async getAll() {
    await delay(250)
    return [...agentData]
  },

  async getById(id) {
    await delay(200)
    const agent = agentData.find(item => item.id === id)
    if (!agent) {
      throw new Error('Agent not found')
    }
    return { ...agent }
  },

  async create(agentData) {
    await delay(400)
    const newAgent = {
      ...agentData,
      id: Date.now().toString(),
      rating: 0,
      listings: []
    }
    return { ...newAgent }
  },

  async update(id, updates) {
    await delay(350)
    const agentIndex = agentData.findIndex(item => item.id === id)
    if (agentIndex === -1) {
      throw new Error('Agent not found')
    }
    
    const updatedAgent = {
      ...agentData[agentIndex],
      ...updates
    }
    
    return { ...updatedAgent }
  },

  async delete(id) {
    await delay(250)
    const agentIndex = agentData.findIndex(item => item.id === id)
    if (agentIndex === -1) {
      throw new Error('Agent not found')
    }
    
    return { success: true, id }
  }
}

export default agentService