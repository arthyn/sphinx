import { Charge, ChargeUpdateInitial, getVats, scryCharges, Vat, Vats } from "@urbit/api";
import { useQuery } from "react-query"
import api from "../api";
import { Post } from "../types/sphinx";

function getAppPost(app: string, vat: Vat, charge: Charge): Post {
  const ship = vat.arak.rail?.publisher || vat.arak.rail?.ship || `~${window.ship}`;

  return {
    type: 'app',
    title: charge.title,
    link: `web+urbitgraph://${ship}/${app}`,
    description: charge.info || charge.title,
    image: charge.image || '',
    tags: ['app']
  }
}

export const useApps = () => {
  const { data: vats } = useQuery('vats', () => api.scry<Vats>(getVats));
  const { data: charges } = useQuery('charges', () => api.scry<ChargeUpdateInitial>(scryCharges));

  return vats && charges ? Object.entries(charges.initial).filter(([k]) => k in vats).map(([k,v]) => ({ key: k, post: getAppPost(k, vats[k], v) })) : [];
}