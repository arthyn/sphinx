import { ChargeUpdateInitial, scryCharges } from '@urbit/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../api';

interface Pal {
  lists: string[];
  ack: true | null;
}

interface Pals {
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
  const { data: charges } = useQuery('charges', () => {
    return api.scry<ChargeUpdateInitial>(scryCharges);
  })
  const { data } = useQuery('pals', () => {
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
      queryClient.invalidateQueries('pals');
    }
  })

  return {
    installed: !charges ? true : 'pals' in charges.initial,
    incoming: data ? Object.keys(data.incoming) : [],
    outgoing: data ? data.outgoing : {},
    remove
  }
}