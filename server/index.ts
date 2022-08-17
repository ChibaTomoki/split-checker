import express, { json } from 'express'
import connetDB from './db/connect'
import Item from './db/Item'

const app: express.Express = express()
app.use(json())

const start = async (): Promise<void> => {
  console.log('start() is called')
  try {
    await connetDB(process.env.MONGO_HEROKU_URL || process.env.MONGO_URL)
  } catch (error) {
    console.log(error)
  }
}

start()

app.get('/', async (req, res) => {
  console.log('api get is called')
  try {
    const allItem = await Item.find(req.body)
    res.status(200).json(allItem)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post('/', async (req, res) => {
  console.log('api post is called')
  try {
    const createItem = await Item.create(req.body)
    res.status(200).json(createItem)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.delete('/:id', async (req, res) => {
  console.log('api delete is called')
  try {
    await Item.deleteOne({ _id: req.params.id })
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.delete('/', async (_, res) => {
  console.log('api delete_all is called')
  try {
    await Item.deleteMany({})
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.put('/:id', async (req, res) => {
  console.log('api put is called')
  try {
    await Item.replaceOne({ _id: req.params.id }, req.body)
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json(error)
  }
})

export default {
  path: '/api',
  handler: app,
}
