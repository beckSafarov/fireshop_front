import axios from 'axios'

export const axiosConfig = { cancelToken: axios.CancelToken.source().token }

export const config = {
  headers: { 'Content-Type': 'application/json' },
  ...axiosConfig,
}
