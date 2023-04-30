import { ChargeUpdateInitial, scryCharges } from '@urbit/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { CHARGES_KEY, PALS_KEY } from '../keys';

interface Pal {
  lists: string[];
  ack: true | null;
}

export interface Pals {
  [k: string]: Pal;
}

interface PalsData {
  incoming: Pals;
  outgoing: Pals;
  [k: string]: Pal | Pals;
}

interface RemovePal {
  part: {
    ship: string;
    in: string[];
  }
}

export const usePals = () => {
  const queryClient = useQueryClient();
  const { data: charges } = useQuery(CHARGES_KEY, () => {
    return api.scry<ChargeUpdateInitial>(scryCharges);
  })
  const { data } = useQuery(PALS_KEY, () => {
    return api.scry<PalsData>({
      app: 'pals',
      path: '/json'
    });
  });
  const { mutate: remove } = useMutation((pal: string) => {
    return api.poke<RemovePal>({
      app: 'pals',
      mark: 'pals-command',
      json: {
        part: {
          ship: pal,
          in: []
        }
      }
    })
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(PALS_KEY);
    }
  })

  return {
    installed: !charges ? true : 'pals' in charges.initial,
    incoming: data ? Object.keys(data.incoming) : [],
    outgoing: data ? data.outgoing : {},
    remove
  }
}