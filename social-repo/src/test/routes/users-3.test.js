const request = require('supertest')
const buildApp = require('../../app')
const pool = require('../../pool')
const userRepo = require('../../repos/user-repo')
const Context = require('../context')

let context

//The function in the below function will be run before any tests
beforeAll(async ()=>{
  context = await Context.build()
})

beforeEach(async()=>{
  await context.reset()
})

afterAll(()=>{
  return context.close()
})

//jest executes the test files in parallel
it('create a user',async ()=>{
  const startingCount = await userRepo.count()
  // expect(startingCount).toEqual(0) //We expect there to be no users in this clean environment

  await request(buildApp()).post('/users').send({username:'testuser', bio: 'test bio'}).expect(200);

  const finishCount = await userRepo.count()
  expect(finishCount-startingCount).toEqual(1)
  
})