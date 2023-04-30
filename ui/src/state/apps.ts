import { Charge, ChargeUpdateInitial, getPikes, Pike, Pikes, scryCharges } from "@urbit/api";
import { useQuery } from "@tanstack/react-query"
import api from "../api";
import { Post, Search } from "../types/sphinx";
import { APP_LISTINGS_KEY, CHARGES_KEY, VATS_KEY } from "../keys";

function getAppPost(app: string, pike: Pike, charge: Charge): Post {
  const ship = pike.sync?.ship || `~${window.ship}`;

  return {
    type: 'app',
    title: charge.title,
    link: `/1/desk/${ship}/${app}`, //`/apps/grid/search/${ship}/apps/${ship}/${app}`,
    description: charge.info || charge.title,
    image: charge.image || '',
    color: charge.color,
    tags: ['app']
  }
}

export const useApps = () => {
  const { data: pikes, isLoading: pikesLoading } = useQuery(VATS_KEY, () => api.scry<Pikes>(getPikes));
  const { data: charges, isLoading: chargesLoading } = useQuery(CHARGES_KEY, () => api.scry<ChargeUpdateInitial>(scryCharges));
  const { data, isLoading } = useQuery(APP_LISTINGS_KEY, () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/app/0/999'
  }));

  return {
    loading: pikesLoading || chargesLoading || isLoading,
    apps: !pikes || !charges || !data ? [] : Object.entries(charges.initial)
    .filter(([k]) => k in pikes)
    .map(([k,v]) => ({ key: k, post: getAppPost(k, pikes[k], v) }))
    .filter(({ post }) => !data.listings.some(l => l.post.link === post.link || l.post.title === post.title))
  }
}