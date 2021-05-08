import { Crop, Field, HumusBalanceData } from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const calculateHumusBalance = async (fields: Array<Field>): Promise<Array<HumusBalanceData>> =>
  await fetch(`${SOIL_SERVICE_URL}/humus_balance`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'X-CSRF-Token': token
      },
      body: JSON.stringify(fields)
    }).then(response => response.json())
