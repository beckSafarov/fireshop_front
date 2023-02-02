import axios from 'axios'

export const fullConfig = {
  headers: { 'Content-Type': 'application/json' },
  cancelToken: axios.CancelToken.source().token,
}

export const cancelTokenConfig = {
  cancelToken: axios.CancelToken.source().token,
}
