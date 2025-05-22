import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { Tipo } from './index'

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
  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' })
  }

  try {
    const tipos = await readData()
    const index = tipos.findIndex((t) => String(t.id) === id)
    if (index === -1) {
      return res.status(404).json({ message: 'Tipo no encontrado' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(tipos[index])
    }

    if (req.method === 'PUT') {
      const { nombre, descripcion, propiedades } = req.body
      if (
        typeof nombre !== 'string' ||
        typeof descripcion !== 'string' ||
        !Array.isArray(propiedades)
      ) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }
      tipos[index] = {
        ...tipos[index],
        nombre,
        descripcion,
        propiedades,
      }
      await writeData(tipos)
      return res.status(200).json(tipos[index])
    }

    if (req.method === 'DELETE') {
      const [deleted] = tipos.splice(index, 1)
      await writeData(tipos)
      return res.status(200).json(deleted)
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error(`API /api/tipos/${id} error:`, error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
