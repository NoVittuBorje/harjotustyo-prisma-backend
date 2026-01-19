import { prisma } from "./prisma"

import jwt from 'jsonwebtoken';
async function main() {
  // Create a new user
  const user = await prisma.users.create({
    data: {
        username:"Borje",
        email:"jere.pode@hotmail.com",
        password_hash: jwt.sign("salasana","secret")
    },
  })
  console.log('Created user:', user)

  // Fetch all users
  const allUsers = await prisma.users.findMany()
  console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })