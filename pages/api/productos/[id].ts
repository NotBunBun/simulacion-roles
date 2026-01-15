import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { Producto } from './index'

const FILE_PATH = path.join(process.cwd(), 'data', 'productos.json')

async function readData(): Promise<Producto[]> {
  try {
    const json = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(json)
  } catch (err: any) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

async function writeData(data: Producto[]): Promise<void> {
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
    const productos = await readData()
    const index = productos.findIndex((p) => String(p.id) === id)
    if (index === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(productos[index])
    }

    if (req.method === 'PUT') {
      const { nombre, tipoId, descripcion, precio, stock, propiedadValores } = req.body

      if (
        typeof nombre !== 'string' ||
        typeof tipoId !== 'number' ||
        typeof descripcion !== 'string' ||
        typeof precio !== 'number' ||
        typeof stock !== 'number' ||
        typeof propiedadValores !== 'object'
      ) {
        return res.status(400).json({ message: 'Datos inválidos' })
      }

      productos[index] = {
        ...productos[index],
        nombre,
        tipoId,
        descripcion,
        precio,
        stock,
        propiedadValores,
      }
      await writeData(productos)
      return res.status(200).json(productos[index])
    }

    if (req.method === 'DELETE') {
      const [deleted] = productos.splice(index, 1)
      await writeData(productos)
      return res.status(200).json(deleted)
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error(`API /api/productos/${id} error:`, error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
