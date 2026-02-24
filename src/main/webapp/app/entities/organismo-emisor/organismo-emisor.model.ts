export interface IOrganismoEmisor {
  id: number;
  nombre?: string | null;
  codigo?: string | null;
}

export type NewOrganismoEmisor = Omit<IOrganismoEmisor, 'id'> & { id: null };
