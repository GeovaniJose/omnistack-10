const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

// index, show, store, update, delete

module.exports = {
  async index(req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      )

      // eslint-disable-next-line no-undef
      const { name = login, avatar_url, bio } = response.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }

    return res.json(dev)
  },

  async destroy(req, res) {
    const dev = await Dev.findByIdAndRemove(req.params.id)

    return res.json(dev)
  }
}
