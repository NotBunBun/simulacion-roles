import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { Propiedad } from './index'

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
  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' })
  }

  try {
    const props = await readData()
    const index = props.findIndex((p) => String(p.id) === id)
    if (index === -1) {
      return res.status(404).json({ message: 'Propiedad no encontrada' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(props[index])
    }

    if (req.method === 'PUT') {
      const { nombre, tipoPropiedad } = req.body
      if (
        typeof nombre !== 'string' ||
        typeof tipoPropiedad !== 'string'
      ) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }
      props[index] = {
        ...props[index],
        nombre,
        tipoPropiedad,
      }
      await writeData(props)
      return res.status(200).json(props[index])
    }

    if (req.method === 'DELETE') {
      const [removed] = props.splice(index, 1)
      await writeData(props)
      return res.status(200).json(removed)
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error(`API /api/propiedades/${id} error:`, error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
