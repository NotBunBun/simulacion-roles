import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

export interface Producto {
  id: number
  nombre: string
  tipoId: number
  descripcion: string
  precio: number
  stock: number
  propiedadValores: { [propiedadId: number]: string | number | boolean }
  createdAt: string
}

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
  try {
    const productos = await readData()

    if (req.method === 'GET') {
      return res.status(200).json(productos)
    }

    if (req.method === 'POST') {
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

      const newProducto: Producto = {
        id: Date.now(),
        nombre,
        tipoId,
        descripcion,
        precio,
        stock,
        propiedadValores,
        createdAt: new Date().toISOString(),
      }

      productos.push(newProducto)
      await writeData(productos)
      return res.status(201).json(newProducto)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API /api/productos error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
