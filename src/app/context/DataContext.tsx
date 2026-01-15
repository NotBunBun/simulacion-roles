'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface Tipo {
  id: number;
  nombre: string;
  descripcion: string;
  propiedades: number[];
  createdAt: string;
}

export interface Propiedad {
  id: number;
  nombre: string;
  tipoPropiedad: string;
  createdAt: string;
}

export interface Producto {
  id: number;
  nombre: string;
  tipoId: number;
  descripcion: string;
  precio: number;
  stock: number;
  propiedadValores: { [propiedadId: number]: string | number | boolean };
  createdAt: string;
}

interface DataContextProps {
  tipos: Tipo[];
  propiedades: Propiedad[];
  productos: Producto[];
  loading: boolean;
  error: string | null;
  addTipo: (data: Omit<Tipo, 'id' | 'createdAt'>) => Promise<void>;
  updateTipo: (tipo: Tipo) => Promise<void>;
  deleteTipo: (id: number) => Promise<void>;
  addPropiedad: (data: Omit<Propiedad, 'id' | 'createdAt'>) => Promise<void>;
  updatePropiedad: (prop: Propiedad) => Promise<void>;
  deletePropiedad: (id: number) => Promise<void>;
  addProducto: (data: Omit<Producto, 'id' | 'createdAt'>) => Promise<void>;
  updateProducto: (producto: Producto) => Promise<void>;
  deleteProducto: (id: number) => Promise<void>;
  retryFetch: () => Promise<void>;
}

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tRes, pRes, prodRes] = await Promise.all([
        fetch('/api/tipos'),
        fetch('/api/propiedades'),
        fetch('/api/productos'),
      ]);
      if (tRes.ok) setTipos(await tRes.json());
      if (pRes.ok) setPropiedades(await pRes.json());
      if (prodRes.ok) setProductos(await prodRes.json());
    } catch (err) {
      setError('Error al cargar datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const retryFetch = async () => {
    await fetchData();
  };

  const addTipo = async (data: Omit<Tipo, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/tipos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear Tipo');
    const nuevo = await res.json();
    setTipos((old) => [...old, nuevo]);
  };

  const updateTipo = async (tipo: Tipo) => {
    const res = await fetch(`/api/tipos/${tipo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tipo),
    });
    if (!res.ok) throw new Error('Error al actualizar Tipo');
    const updated = await res.json();
    setTipos((old) =>
      old.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const deleteTipo = async (id: number) => {
    const res = await fetch(`/api/tipos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar Tipo');
    setTipos((old) => old.filter((t) => t.id !== id));
  };

  const addPropiedad = async (
    data: Omit<Propiedad, 'id' | 'createdAt'>
  ) => {
    const res = await fetch('/api/propiedades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear Propiedad');
    const nuevo = await res.json();
    setPropiedades((old) => [...old, nuevo]);
  };

  const updatePropiedad = async (prop: Propiedad) => {
    const res = await fetch(`/api/propiedades/${prop.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prop),
    });
    if (!res.ok) throw new Error('Error al actualizar Propiedad');
    const updated = await res.json();
    setPropiedades((old) =>
      old.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deletePropiedad = async (id: number) => {
    const res = await fetch(`/api/propiedades/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar Propiedad');
    setPropiedades((old) => old.filter((p) => p.id !== id));
  };

  const addProducto = async (data: Omit<Producto, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear Producto');
    const nuevo = await res.json();
    setProductos((old) => [...old, nuevo]);
  };

  const updateProducto = async (producto: Producto) => {
    const res = await fetch(`/api/productos/${producto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) throw new Error('Error al actualizar Producto');
    const updated = await res.json();
    setProductos((old) =>
      old.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deleteProducto = async (id: number) => {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar Producto');
    setProductos((old) => old.filter((p) => p.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        tipos,
        propiedades,
        productos,
        loading,
        error,
        addTipo,
        updateTipo,
        deleteTipo,
        addPropiedad,
        updatePropiedad,
        deletePropiedad,
        addProducto,
        updateProducto,
        deleteProducto,
        retryFetch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
