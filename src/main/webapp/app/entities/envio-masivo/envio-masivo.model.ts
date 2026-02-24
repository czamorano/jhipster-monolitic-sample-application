import dayjs from 'dayjs/esm';

import { IAplicacion } from 'app/entities/aplicacion/aplicacion.model';
import { EstadoEnvioMasivo } from 'app/entities/enumerations/estado-envio-masivo.model';
import { TipoEnvioMasivo } from 'app/entities/enumerations/tipo-envio-masivo.model';
import { IOrganismoEmisor } from 'app/entities/organismo-emisor/organismo-emisor.model';

export interface IEnvioMasivo {
  id: number;
  identificador?: string | null;
  tipo?: keyof typeof TipoEnvioMasivo | null;
  estado?: keyof typeof EstadoEnvioMasivo | null;
  comienzo?: dayjs.Dayjs | null;
  fin?: dayjs.Dayjs | null;
  aplicacion?: IAplicacion | null;
  organismoEmisor?: IOrganismoEmisor | null;
}

export type NewEnvioMasivo = Omit<IEnvioMasivo, 'id'> & { id: null };
