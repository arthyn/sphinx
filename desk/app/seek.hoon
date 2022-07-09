/-  s=seek
/+  gossip, default-agent, verb, dbug
/+  *seek
/+  sift
/$  grab-listing  %noun  %directory-listing
/$  grab-directory  %noun  %directory
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  state-0
    $:  %0
        =lookup:s
        =trigrams:s
        =trail:s
        =directory:s
        published=directory:s
    ==
  --
=|  state-0
=*  state  -
=<
  %+  verb  &
  %-  %+  agent:gossip
      [2 %mutuals %mutuals]
    %-  malt
    ^-  (list [mark $-(* vase)])
    :~  [%directory-listing |=(n=* !>((grab-listing n)))]
        [%directory |=(n=* !>((grab-directory n)))]
    ==
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %.n) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init  
    ^-  (quip card _this)
    =^  cards  state
      abet:init:cor
    [cards this]
  ::
  ++  on-save  !>(state)
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =/  old=(unit state-0)
      (mole |.(!<(state-0 vase)))  
    ?^  old  `this(state u.old)
    ~&  >>>  "Incompatible load, nuking"
    =^  cards  this  on-init
    :_  this
    =-  (welp - cards)
    %+  turn  ~(tap in ~(key by wex.bowl))
    |=  [=wire =ship =term] 
    ^-  card
    [%pass wire %agent [ship term] %leave ~]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:cor mark vase)
    [cards this]
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state
      abet:(watch:cor path)
    [cards this]
  ::
  ++  on-peek   peek:cor
  ::
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^  cards  state
      abet:(agent:cor wire sign)
    [cards this]
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:cor wire sign)
    [cards this]
  --
|_  [=bowl:gall cards=(list card)]
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  give  |=(=gift:agent:gall (emit %give gift))
++  init
  ^+  cor
  cor
++  poke
  |=  [=mark =vase]
  |^  ^+  cor 
  ?+    mark  ~|(bad-poke/mark !!)
      %directory-listing
    =+  !<(=listing:s vase)
    (publish listing)
  ==
  ++  publish
    |=  =listing:s
    ^+  cor
    ::  
    ?>  =(src.bowl source.listing)
    ?>  from-self
    ?>  =(hash.listing (digest post.listing))
    ?:  (~(has by directory) hash.listing)
      ~&  'Listing already exists.'
      cor
    =.  published  (~(put by directory) hash.listing listing)
    di-abet:(di-publish:(di-abed:di-core hash.listing) listing)
  --
:: 
++  watch
  |=  =path
  ^+  cor
  ?+    path  ~|(bad-watch-path/path !!)
      [%~.~ %gossip %source ~]
    (give %fact ~ directory+!>(published))
  ==
++  agent
  |=  [=wire =sign:agent:gall]
  ^+  cor
  ?+    wire  ~|(bad-agent-wire/wire !!)
      [%~.~ %gossip %gossip ~]
    ?+  -.sign  ~|([%unexpected-gossip-sign -.sign] !!)
        %fact
      =*  mark  p.cage.sign
      =*  vase  q.cage.sign
      ?+  mark
            ~&  [dap.bowl %unexpected-mark-fact mark wire=wire]
            cor
          %directory-listing
        =+  !<(=listing:s vase)
        ?>  =(hash.listing (digest post.listing))
        ?:  (~(has by directory) hash.listing)
        ~&  'Listing already exists.'
        cor
        di-abet:(di-publish:(di-abed:di-core hash.listing) listing)
      ::
          %directory
        =+  !<(d=directory:s vase)
        cor(directory (~(uni by directory) d))
      ==
    ==
  ==
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ~&  arvo/wire
  cor
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
      [%x %lookup @ @ @ ~]  
    =-  ``search+!>(-)
    ^-  search:s
    =/  start  (slav %ud i.t.t.t.path)
    =/  limit  (slav %ud i.t.t.t.t.path)
    ::  expects encoded @t values)
    =/  term   `@t`(slav %t i.t.t.path)
    =/  term-counts  (get-term-counts term)
    ~&  term-counts
    =/  terms   (get-terms term-counts)
    ~&  terms
    =/  all=(list listing:s)
      %-  zing
      %+  turn
        terms
      |=  [=key:s v=@ud]
      (get-listings (get-hashes key))
    =/  listings  (swag [start limit] all)
    :*  listings
        start 
        limit 
        (lent listings)
        (lent all)
    ==
  ==
::
++  get-terms
  |=  tally=(map @t @ud)
  ^-  (list [@t @ud])
  =/  sorted
    %+  sort
      ~(tap by tally)
    |=  [[k=@t v=@ud] [l=@t w=@ud]]
    (lth v w)
  =/  median-index  (div (lent sorted) 2)
  =/  q1  (median (scag +(median-index) sorted))
  =/  q3  (median (slag median-index sorted))
  =/  iqr  (sub q3 q1)      
  %+  skim
    sorted
  |=  [k=@t v=@ud]
  (gth:rs (sun:rs v) (mul:rs (sun:rs q3) .1.5))
++  median
  |=  terms=(list [k=@t v=@ud])
  ^-  @ud
  =/  length  (lent terms)
  =/  middle  (div length 2)
  ?.  =((mod length 2) 0)  (tail (snag middle terms))
  %+  div 
    %+  add 
      (tail (snag middle terms))
    (tail (snag +(middle) terms))
  2
++  get-term-counts
  |=  term=@t
  ^-  (map @t @ud)
  =/  parts  (split:sift term)
  =/  ngrams=(list @t)
    %-  zing
    %+  turn
      parts
    |=  part=@t
    (iching part)
  %+  roll
    ngrams
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
++  get-hashes
  |=  =key:s
  ^-  (list hash:s)
  %+  turn  
    %+  sort  (~(gut by lookup) key *(list entry:s))
    |=  [a=entry:s b=entry:s]
    (gte rank.a rank.b)
  |=(=entry:s hash.entry)
++  get-listings
  |=  l=(list hash:s)
  ^-  (list listing:s)
  %+  turn  l
  |=(=hash:s (~(got by directory) hash))
++  from-self  =(our src):bowl
++  di-core
  |_  [=listing:s =hash:s]
  ++  di-core  .
  ++  di-abet
    cor(directory (~(put by directory) hash listing))
  ++  di-abed
    |=  h=hash:s
    di-core(hash h, listing (~(gut by directory) h *listing:s))
  ++  di-publish
    |=  l=listing:s
    =.  listing  l
    =.  cor  (emit (invent:gossip %directory-listing !>(listing)))
    =/  entries=lookup:s
      %-  malt
      %-  zing
      :~  %+  turn
            (sift:sift title.post.l) 
          |=  word=@t
          [word ~[[hash rank=0]]]
          ~[[type.post.l ~[[hash rank=1]]]]
          %+  turn
            tags.post.l
          |=  tag=@t
          [tag ~[[hash rank=2]]]
          %+  turn
            (sift:sift description.post.l)
          |=  word=@t
          [word ~[[hash rank=3]]]          
      ==
    =/  keys  ~(tap in ~(key by entries))
    ~&  keys
    =.  trail  (~(put by trail) hash keys)
    =.  lookup      
      %-  ~(uni by entries)
      %-  ~(rut by lookup)
      |=  [=key:s value=(list entry:s)]
      ?.  (~(has by entries) key)  value
      (weld value (~(got by entries) key))
    =.  trigrams
      %+  roll
        %+  snoc
          %+  turn  keys
          |=  =key:s
          %-  malt
          %+  turn  (iching key)
          |=  =trigram:s
          [trigram (silt ~[key])]
        trigrams
      |=  [next=trigrams:s t=trigrams:s]
      %-  (~(uno by t) next)
      |=  [k=key:s v=(set key:s) w=(set key:s)]
      (~(uni in v) w)
    di-core
  --
--