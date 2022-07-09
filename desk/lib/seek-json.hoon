/-  s=seek
|%
++  enjs
  =,  enjs:format
  |%
  ++  post
    |=  p=post:s
    %-  pairs
    :~  title/s/title.p
        type/s/type.p
        link/s/link.p
        description/s/description.p
        image/s/image.p
        tags/a/(turn tags.p (lead %s))
    ==
  ++  listing
    |=  l=listing:s
    %-  pairs
    :~  post/(post post.l)
        hash/s/(scot %uv hash.l)
        source/s/(scot %p source.l)
        time/(time time.l)
    ==
  ++  search
    |=  =search:s
    %-  pairs
    :~  listings/a/(turn listings.search listing)
        start/n/(scot %ud start.search)
        limit/n/(scot %ud limit.search)
        size/n/(scot %ud size.search)
        total/n/(scot %ud total.search)
    ==
  --
++  dejs
  =,  dejs:format
  |%

  --
--