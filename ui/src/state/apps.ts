import { Charge, ChargeUpdateInitial, getVats, scryCharges, Vat, Vats } from "@urbit/api";
import { useQuery } from "react-query"
import api from "../api";
import { Post, Search } from "../types/sphinx";

function getAppPost(app: string, vat: Vat, charge: Charge): Post {
  const ship = vat.arak.rail?.publisher || vat.arak.rail?.ship || `~${window.ship}`;

  return {
    type: 'app',
    title: charge.title,
    link: `web+urbitgraph://${ship}/${app}`,
    description: charge.info || charge.title,
    image: charge.image || '',
    color: charge.color,
    tags: ['app']
  }
}

export const useApps = () => {
  const { data: vats, isLoading: vatsLoading } = useQuery('vats', () => api.scry<Vats>(getVats));
  const { data: charges, isLoading: chargesLoading } = useQuery('charges', () => api.scry<ChargeUpdateInitial>(scryCharges));
  const { data, isLoading } = useQuery('app-listings', () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/app/0/999'
  }));

  return {
    loading: vatsLoading || chargesLoading || isLoading,
    apps: !vats || !charges || !data ? [] : Object.entries(charges.initial)
    .filter(([k]) => k in vats)
    .map(([k,v]) => ({ key: k, post: getAppPost(k, vats[k], v) }))
    .filter(({ post }) => !data.listings.some(l => l.post.link === post.link || l.post.title === post.title))
  }
}