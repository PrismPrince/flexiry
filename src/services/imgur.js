import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.imgur.com/3',
  headers: {
    Authorization: `Client-ID ${process.env.VUE_APP_IMGUR_KEY}`
  }
})
