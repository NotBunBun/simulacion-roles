import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

export interface Propiedad {
  id: number
  nombre: string
  tipoPropiedad: string
  createdAt: string
}

const FILE_PATH = path.join(process.cwd(), 'data', 'propiedades.json')

async function readData(): Promise<Propiedad[]> {
  try {
    const json = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(json)
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeData(data: Propiedad[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const props = await readData()

    if (req.method === 'GET') {
      return res.status(200).json(props)
    }

    if (req.method === 'POST') {
      const { nombre, tipoPropiedad } = req.body
      if (
        typeof nombre !== 'string' ||
        typeof tipoPropiedad !== 'string'
      ) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }

      const newProp: Propiedad = {
        id: Date.now(),
        nombre,
        tipoPropiedad,
        createdAt: new Date().toISOString(),
      }
      props.push(newProp)
      await writeData(props)
      return res.status(201).json(newProp)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API /api/propiedades error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
