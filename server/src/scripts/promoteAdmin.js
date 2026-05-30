import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

const promoteUser = async () => {
  const phoneOrVpa = process.argv[2]
  if (!phoneOrVpa) {
    console.error('Usage: node promoteAdmin.js <phoneOrVpa>')
    process.exit(1)
  }

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cloud_income'
    await mongoose.connect(mongoUri)
    console.log('Connected to Database.')

    const query = phoneOrVpa.trim()
    const user = await User.findOne({
      $or: [{ phone: query }, { vpa: query }]
    })

    if (!user) {
      console.error(`User not found with phone or VPA: "${query}"`)
      process.exit(1)
    }

    user.isAdmin = true
    await user.save()

    console.log(`Success: User ${user.name} (${user.phone} / ${user.vpa}) has been promoted to Super Admin.`)
    process.exit(0)
  } catch (error) {
    console.error('Error promoting user:', error)
    process.exit(1)
  }
}

promoteUser()
