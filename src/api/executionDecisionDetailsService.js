import axios from 'axios'
import { TradingApiBaseUrl } from '../config'

const httpClient = axios.create({
  baseURL: TradingApiBaseUrl,
})

export const getExecutionDecisionDetailsList = async () => {
  const { data } = await httpClient.get('/api/ExecutionDecisionDetails')

  return data
}

export const getExecutionDecisionDetails = async (id) => {
  const { data } = await httpClient.get(`/api/ExecutionDecisionDetails/${id}`)

  return data
}
