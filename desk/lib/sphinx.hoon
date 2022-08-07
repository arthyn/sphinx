/-  *sphinx
/+  sift
/+  *validate-url
/+  m=metaphone
|%
++  iching
  |=  word=@t
  ^-  (list @t)
  =/  w  (trip word)
  =.  w
    ?.  (lth (lent w) 3)  w
    (weld w (reap (sub 3 (lent w)) ' '))
  %+  turn
    (gulf 0 (sub (lent w) 3))
  |=  index=@ud
  %-  crip
  ^-  tape
  ^-  (list @) 
  %+  sort
    `(list @ud)``(list @)`(swag [index 3] w)
  |=  [p=@ud q=@ud]
  (gth q p)
++  digest
  |=  =post
  ^-  @uv
  %-  shax 
  %-  crip
  :~  title.post
      `@t`type.post
      link.post
      image.post
      description.post
      (crip tags.post)
  ==
++  uprank
  |=  offset=@ud
  |=  =entry
  ^-  ^entry
  [hash.entry (add rank.entry offset)]
++  sort-entries
  |=  entries=(list entry)
  %+  sort  entries
  |=  [a=entry b=entry]
  (gth rank.a rank.b)
++  get-hashes
  |=  entries=(list entry)
  %+  turn  
    entries
  |=(=entry hash.entry)
++  lengths-valid
  |=  l=listing
  ?&  (lte (lent (trip title.post.l)) 77)
      (lte (lent (trip description.post.l)) 256)
      (lte (lent tags.post.l) 8)
      (lte (lent (trip link.post.l)) 1.024)
      (lte (lent (trip image.post.l)) 1.024)
  ==
++  urls-valid
  |=  l=listing
  =/  image
      ?:  =(image.post.l '')  'X'
      (validate image.post.l)
  =/  link  (validate link.post.l)
  &(!=(image ~) !=(link ~))
++  listing-valid
  |=  l=listing
  =/  lengths  (lengths-valid l)
  =/  urls  (urls-valid l)
  :: ~&  title.post.l
  :: ~&  hash.l
  :: ~&  ['urls' ?:(urls 'valid' 'invalid')]
  :: ~&  ['lengths' ?:(lengths 'valid' 'invalid')]
  &(lengths urls)
++  delver
  |_  [=lookup =trigrams =phonetics =trail]
  ++  get
    ^-  index
    [lookup trigrams phonetics trail]
  ++  catalog
    |=  [=hash l=listing]
    ?.  (listing-valid l)  get  
    =/  entries=^lookup
      %-  malt
      ^-  (list [@t (list entry)])
      %-  zing
      :~  ~[[type.post.l ~[[hash rank=4]]]]
          %+  turn
            (sift:sift description.post.l)
          |=  word=@t
          [word ~[[hash rank=8]]]
          %+  turn
            tags.post.l
          |=  tag=@t
          [(norm:sift tag) ~[[hash rank=12]]]
          %+  turn
            (sift:sift title.post.l)
          |=  word=@t
          [word ~[[hash rank=16]]]
          ~[[(crip (cass (trip title.post.l))) ~[[hash rank=20]]]]
      ==
    =/  keys  ~(tap in ~(key by entries))
    =.  trail  (~(put by trail) hash keys)
    =.  lookup      
      %-  ~(uni by entries)
      %-  ~(rut by lookup)
      |=  [=key value=(list entry)]
      ?.  (~(has by entries) key)  value
      (weld value (~(got by entries) key))
    =.  trigrams
      %+  roll
        %+  snoc
          %+  turn  keys
          |=  =key
          %-  malt
          %+  turn  (iching key)
          |=  =trigram
          [trigram (silt ~[key])]
        trigrams
      |=  [next=^trigrams t=^trigrams]
      %-  (~(uno by t) next)
      |=  [k=key v=(set key) w=(set key)]
      (~(uni in v) w)
    =.  phonetics
      %-  
      %-  ~(uno by phonetics)
        %-  malt
        %+  turn  keys
        |=  =key
        [(utter:m key) (silt ~[key])]
      |=  [k=key v=(set key) w=(set key)]
      (~(uni in v) w)
    get
  ++  get-entries
    |=  query=@t
    ^-  (list entry)
    ?~  (find " " (trip query))
      =/  t  (get-title-entries query)
      :: ~&  t
      ~(tap by (malt t))
    %~  tap  by
    %-  
      %~  uni  by   :: union and prefer title entries (better rank)
      (malt (get-part-entries query))
    (malt (get-title-entries query))
  ++  get-part-entries
    |=  query=@t
    ^-  (list entry)
    =/  parts   (sift:sift query)  :: split query
    %-  sum-ranks
    %-  zing
    %+  turn
      parts
    |=  word=@t
    ;:  weld
      (get-phonetics word)
      (turn (get-trigrams word) (uprank 2))
      (turn (get-exact word) (uprank 6))
    ==
  ++  get-title-entries
    |=  query=@t
    ^-  (list entry)
    =/  title   (norm:sift query)  :: full query
    =/  exact  (turn (get-exact title) (uprank 8))
    =/  trigrams  (turn (get-trigrams title) (uprank 4))
    =/  phonetics  (get-phonetics title)
    ;:  weld
      phonetics
      trigrams
      exact
    ==
  ++  sum-ranks
    |=  entries=(list entry)
    ^-  (list entry)
    %+  turn
      %~  tap  by
      %+  roll
        entries
      |=  [=entry gourd=(jar hash rank)]
      (~(add ja gourd) entry)
    |=  [=hash es=(list rank)]
    ^-  entry
    [hash (roll es add)]
  ++  get-exact
    |=  term=@t
    (~(gut by lookup) term *(list entry))
  ++  get-trigrams
    |=  term=@t
    ^-  (list entry)
    %-  zing
    %+  turn 
      (get-keys term) 
    |=  item=@t
    (~(gut by lookup) item *(list entry))
  ++  get-phonetics
    |=  term=key
    ^-  (list entry)
    =/  keys
      %+  skim
        %~  tap  in
        (~(gut by phonetics) (utter:m term) *(set key))
      |=  word=key
      !=(term word)
    %+  roll
      keys    
    |=  [word=key entries=(list entry)]
    %+  weld 
      entries 
    (~(gut by lookup) word *(list entry))
  ++  get-keys
    |=  term=@t
    ^-  (list @t)
    =/  tally   (get-term-counts term)
    =/  tallys  ~(tap by tally)
    =/  count   (lent (iching term))
    %+  turn
      %+  sort    
        %+  skim
          tallys
        |=  [k=@t v=@ud]
        (gth:rs (div:rs (sun:rs v) (sun:rs count)) .0.6)
      |=  [[k=@t v=@ud] [l=@t w=@ud]]
      (lth v w) 
    |=  [k=@t v=@ud]
    k
  ++  get-term-counts
    |=  term=@t
    ^-  (map @t @ud)
    %+  roll
      (iching term)
    |=  [ngram=@t tally=(map @t @ud)]
    ^-  (map @t @ud)
    =/  words=(set @t)  (~(gut by trigrams) ngram *(set @t))
    %-  
      %-  ~(uno by tally)
        %-  malt
        %+  turn
          ~(tap in words)
        |=  word=@t
        [word 1]
    |=  [k=@t v=@ud w=@ud]
    (add v w) 
  --
--