/-  *sphinx
/+  sift
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
++  derank
  |=  [=entry offset=@ud]
  [hash.entry (add rank.entry offset)]  :: phonetically similar should be lower
++  sort-entries
  |=  entries=(list entry)
  %+  sort  entries
  |=  [a=entry b=entry]
  (lth rank.a rank.b)
++  get-hashes
  |=  entries=(list entry)
  %+  turn  
    entries
  |=(=entry hash.entry)
++  delver
  |_  [=lookup =trigrams =phonetics]
  ++  get-entries
    |=  =key
    ^-  (list entry)
    =/  title   (norm:sift key)  :: full query
    =/  parts   (sift:sift key)  :: split query
    =/  title-entries
      %-  malt
      ;:  weld
        (get-phonetics title)
        (get-trigram-entries title)
        (~(gut by lookup) title *(list entry))
      ==
    %~  tap  by
    %-  
      %~  uni  by   :: union and prefer title entries (better rank)
      %-  malt
      %-  zing
      %+  turn
        parts
      |=  word=@t
      %+  turn
        ;:  weld
          (get-phonetics word)
          (get-trigram-entries word)
          (~(gut by lookup) word *(list entry))
        ==
      |=  =entry
      (derank entry 10)
    title-entries
  ++  get-trigram-entries
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
      |=  [word=key]
      !=(term word)
    %+  roll
      keys    
    |=  [word=key entries=(list entry)]
    %+  weld 
      entries 
    %+  turn
      (~(gut by lookup) word *(list entry))
    |=  =entry
    (derank entry 10)
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