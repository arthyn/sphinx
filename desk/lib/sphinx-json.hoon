/-  s=sphinx
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
  ++  directory
    |=  d=directory:s
    %-  pairs
    %+  turn  ~(tap by d)
    |=  [=hash:s l=listing:s]
    [(scot %uv hash) (listing l)]
  --
++  dejs
  =,  dejs:format
  |%
  ++  declarations  (ar declare)
  ++  declare
    ^-  $-(json declare:s)
    %-  ot
    :~  reach/(su (perk [%friends %public %private ~]))
        post/post
    ==
  ++  post
    ^-  $-(json post:s)
    %-  ot
    :~  title/so
        type/type
        link/so
        description/so
        tags/(ar so)
        image/so
    ==
  ++  type  (su (perk [%app %group %content %other ~]))
  --
--