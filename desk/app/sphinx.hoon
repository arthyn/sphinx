/-  s=sphinx
/+  gossip, default-agent, verb, dbug
/+  *sphinx
/+  *validate-url
/+  sift
/+  m=metaphone
/$  grab-listing  %noun  %directory-listing
/$  grab-directory  %noun  %directory
=,  de-purl:html
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  edition
    $%  state-0
        state-1
    ==
  +$  state-1
    $:  %1
        =lookup:s
        =trigrams:s
        =phonetics:s
        =trail:s
        =directory:s
        published=directory:s
    ==
  +$  state-0
    $:  %0
        =lookup:s
        =trigrams:s
        =phonetics:s
        =trail:s
        =directory:directory-state-zero:s
        published=directory:directory-state-zero:s
    ==
  --
=|  state-1
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
    =/  old  !<(edition vase)
    |^
    ?-  -.old
      %1  `this(state old(published (purge published.old)))
        %0
      %_  $
        -.old  %1
        published.old  (purge (directory-0-to-1 published.old))
        directory.old  (directory-0-to-1 directory.old)
      ==
    ==
    ++  directory-0-to-1
      |=  =directory:directory-state-zero:s
      ^-  directory:s
      %-  ~(run by directory)
      |=  =listing:directory-state-zero:s
      ^-  listing:s
      =/  post  post.listing(+63 [+63.post.listing ''])
      listing(+2 post)
    ::
    ++  purge
      |=  =directory:s
      ^-  directory:s
      %-  malt
      %+  skim 
        ~(tap by directory) 
      |=  [=hash:s =listing:s]
      =(our.bowl source.listing)
    --
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
      %declare
    =+  !<(=declare:s vase)
    (publish declare cor)
    ::
      %declarations
    =+  !<(decs=(list declare:s) vase)
    =.  cor  (roll decs publish)
    cor
    ::
      %remove
    =+  !<(=hash:s vase)
    di-abet:di-remove:(di-abed:di-core hash)
  ==
  ++  publish
    |=  [=declare:s core=_cor]
    ^+  cor
    ::  
    ?>  from-self
    =/  listing
      :*  post=q.declare
          hash=(digest q.declare)
          reach=p.declare
          source=our.bowl
          time=now.bowl
      ==
    ?:  (~(has by directory) hash.listing)
      ~&  'Listing already exists.'
      cor
    di-abet:(di-publish:(di-abed:di-core:core hash.listing) listing)
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
        =.  directory  (~(uni by directory) d)
        %+  roll
          ~(tap by d)
        |=  [[=hash:s l=listing:s] c=_cor]
        (index:c hash l)
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
      [%x %published ~]
    ``directory+!>(published)
  ::
      [%x %state ~]
    ``noun+!>(state)
  ::
      [%x %lookup @ @ @ $@(~ [@ ~])]  
    =-  ``search+!>(-)
    ^-  search:s
    =/  filter  
      %+  rash  i.t.t.path 
      (perk [%app %group %content %other %all ~])
    =/  start  (slav %ud i.t.t.t.path)
    =/  limit  (slav %ud i.t.t.t.t.path)
    =/  term   
      ?^  t.t.t.t.t.path  
        `@t`(slav %t i.t.t.t.t.t.path)
      ~
    ::  expects encoded @t values)
    =/  all
      ?~  term
        %+  skim
          ~(val by directory)
        |=  =listing:s
        |(=(filter %all) =(filter type.post.listing))
      =/  entries  (~(get-entries delver [lookup trigrams phonetics]) term)
      :: ~&  %+  turn
      ::   entries
      :: |=  [=hash:s =rank:s]
      :: [(~(got by directory) hash) rank]
      %+  skim
        %-  get-listings
        %-  get-hashes
        %-  sort-entries
        entries
      |=  =listing:s
      |(=(filter %all) =(filter type.post.listing))
    =/  listings  (swag [start limit] all)
    :*  listings
        start 
        limit 
        (lent listings)
        (lent all)
    ==
  ==
++  get-listings
  |=  l=(list hash)
  %+  turn  l
  |=(=hash:s (~(got by directory) hash))
++  from-self  =(our src):bowl
++  di-core
  |_  [=listing:s =hash:s gone=_|]
  ++  di-core  .
  ++  di-abet
    =.  directory
      ?:  gone  (~(del by directory) hash)
    (~(put by directory) hash listing)
    cor
  ++  di-abed
    |=  h=hash:s
    di-core(hash h, listing (~(gut by directory) h *listing:s))
  ++  di-remove
    =.  gone    &
    =/  keys    (~(got by trail) hash)
    =.  trail   (~(del by trail) hash)
    =.  lookup
      ^-  lookup:s
      %-  ~(uni by lookup)
      %-  malt
      %+  turn
        keys
      |=  =key:s
      :-  key
      ^-  (list entry:s)
      %+  skip
        (~(got by lookup) key)
      |=([h=hash:s =rank:s] =(h hash))
    =?  published  (~(has by published) hash)
      (~(del by published) hash)
    di-core
  ++  di-publish
    |=  l=listing:s
    =.  listing  l
    =.  cor  (index hash l)
    =.  published  
      ?.  =(src our):bowl  published
      (~(put by directory) hash.listing listing)
    =.  cor  (emit (invent:gossip %directory-listing !>(listing)))  
    di-core
  --
++  index
  |=  [=hash:s l=listing:s]
  ?>  (lte (lent (trip title.post.l)) 77)
  ?>  (lte (lent (trip description.post.l)) 256)
  ?>  (lte (lent tags.post.l) 8)
  ?>  (lte (lent (trip link.post.l)) 1.024)
  ?>  (lte (lent (trip image.post.l)) 1.024)
  =.  cor
    ?:  =(image.post.l '')  cor
      =/  image  (validate image.post.l)
      cor
  =/  link  (validate link.post.l)
  =/  entries=lookup:s
    %-  malt
    %-  zing
    :~  ~[[(crip (cass (trip title.post.l))) ~[[hash rank=0]]]]
        %+  turn
          (sift:sift title.post.l)
        |=  word=@t
        [word ~[[hash rank=1]]]
        %+  turn
          tags.post.l
        |=  tag=@t
        [(norm:sift tag) ~[[hash rank=2]]]
        %+  turn
          (sift:sift description.post.l)
        |=  word=@t
        [word ~[[hash rank=3]]]
        ~[[type.post.l ~[[hash rank=4]]]]
    ==
  =/  keys  ~(tap in ~(key by entries))
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
  =.  phonetics
    %-  
    %-  ~(uno by phonetics)
      %-  malt
      %+  turn  keys
      |=  =key:s
      [(utter:m key) (silt ~[key])]
    |=  [k=key:s v=(set key:s) w=(set key:s)]
    (~(uni in v) w)
  cor
--