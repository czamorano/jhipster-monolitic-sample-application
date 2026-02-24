export interface IAplicacion {
  id: number;
  nombre?: string | null;
}

export type NewAplicacion = Omit<IAplicacion, 'id'> & { id: null };
