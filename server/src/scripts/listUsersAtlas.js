import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

const listAll = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cloud_income'
    await mongoose.connect(mongoUri)
    console.log('Connected to Atlas DB.')

    const users = await User.find({})
    console.log('--- ALL USERS IN ATLAS DB ---')
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Phone: ${u.phone}, VPA: ${u.vpa}, isAdmin: ${u.isAdmin}`)
    })
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

listAll()
