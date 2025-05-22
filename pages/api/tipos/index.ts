import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

export interface Tipo {
  id: number
  nombre: string
  descripcion: string
  propiedades: number[]
  createdAt: string
}

const FILE_PATH = path.join(process.cwd(), 'data', 'tipos.json')

async function readData(): Promise<Tipo[]> {
  try {
    const json = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(json)
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeData(data: Tipo[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tipos = await readData()

    if (req.method === 'GET') {
      return res.status(200).json(tipos)
    }

    if (req.method === 'POST') {
      const { nombre, descripcion, propiedades } = req.body
      if (
        typeof nombre !== 'string' ||
        typeof descripcion !== 'string' ||
        !Array.isArray(propiedades)
      ) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }

      const newTipo: Tipo = {
        id: Date.now(),
        nombre,
        descripcion,
        propiedades,
        createdAt: new Date().toISOString(),
      }
      tipos.push(newTipo)
      await writeData(tipos)
      return res.status(201).json(newTipo)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API /api/tipos error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
