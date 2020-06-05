const faker = require('faker')
const express = require('express')

const app = express()

app.get('/:seed', (req, res) => {
  const { seed } = req.params

  if (Number.isNaN(Number(seed))) {
    return res.status(400).send('seed needs to be a number')
  }
  
  faker.seed(Number(seed))

  let people = []

  for (let i = 0; i < 100; i++) {
    people.push({ uuid: faker.random.uuid(), fn: faker.name.firstName(), ln: faker.name.lastName(), friends: new Set() })
  }

  for (person of people) {
    for (friend of people) {
      if (faker.random.number() % 50 <= 2) {
        person.friends.add(friend.uuid)
        friend.friends.add(person.uuid)
      }
    }
  }

  return res.json(people.map(p => ({ ...p, friends: Array.from(p.friends)})))
})


app.listen(3000, () => console.log('listening in 3000'))