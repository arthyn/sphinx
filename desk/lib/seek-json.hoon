/-  s=seek
|%
++  enjs
  =,  enjs:format
  |%
  ++  listings
    |=  l=(list listing:s)
    a+(turn l listing)
  ++  listing
    |=  l=listing:s
    %-  pairs
    :~  title/s/title.l
        link/s/link.l
        description/s/description.l
        image/s/image.l
        source/s/(scot %p source.l)
        time/(time time.l)
        tags/a/(turn tags.l (lead %s))
    ==
  --
++  dejs
  =,  dejs:format
  |%

  --
--