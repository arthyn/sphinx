/-  s=sphinx
/+  gossip, default-agent, verb, dbug
/+  *sphinx
/+  sift
/+  m=metaphone
/$  grab-listing  %noun  %directory-listing
/$  grab-directory  %noun  %directory
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  state-0
    $:  %0
        =lookup:s
        =phonetics:s
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
      %declare
    =+  !<(=declare:s vase)
    di-abet:(publish declare di-core)
    ::    %declarations
    :: =+  !<(declared=(list declare:s) vase)
    :: =.  di-core  (roll declared publish)
    :: cor
  ==
  ++  publish
    |=  [=declare:s core=_di-core]
    ^+  di-core
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
      di-core
    =.  published  (~(put by directory) hash.listing listing)
    (di-publish:(di-abed:core hash.listing) listing)
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
      [%x %lookup @ @ @ @ ~]  
    =-  ``search+!>(-)
    ^-  search:s
    =/  filter  
      %+  rash  i.t.t.path 
      (perk [%app %group %content %other %all ~])
    =/  term   `@t`(slav %t i.t.t.t.path)
    =/  start  (slav %ud i.t.t.t.t.path)
    =/  limit  (slav %ud i.t.t.t.t.t.path)
    ::  expects encoded @t values)
    =/  all
      %+  skim
        %-  get-listings
        %-  get-hashes
        %-  sort-entries
        (get-entries term)
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
++  get-entries
  |=  =key:s
  ^-  (list entry:s)
  =/  title   (norm:sift key)  :: full query
  =/  parts   (sift:sift key)  :: split query
  =/  title-entries
    %-  malt
    %+  weld
      (get-phonetics title)
    (~(gut by lookup) title *(list entry:s))
  %~  tap  by
  %-  
    %~  uni  by   :: union and prefer title entries (better rank)
    %-  malt
    %-  zing
    %+  turn
      parts
    |=  word=@t
    %+  turn
      %+  weld
        (get-phonetics word)
      (~(gut by lookup) word *(list entry:s))
    |=  =entry:s
    (derank entry 10)
  title-entries
++  get-phonetics
  |=  =key:s
  ^-  (list entry:s)
  =/  keys
    %+  skim
      %~  tap  in
      (~(gut by phonetics) (utter:m key) *(set key:s))
    |=  [word=key:s]
    !=(key word)
  %+  roll
    keys    
  |=  [word=key:s entries=(list entry:s)]
  %+  weld 
    entries 
  %+  turn
    (~(gut by lookup) word *(list entry:s))
  |=  =entry:s
  (derank entry 10)
++  derank
  |=  [=entry:s offset=@ud]
  [hash.entry (add rank.entry offset)]  :: phonetically similar should be lower
++  sort-entries
  |=  entries=(list entry:s)
  %+  sort  entries
  |=  [a=entry:s b=entry:s]
  (lth rank.a rank.b)
++  get-hashes
  |=  entries=(list entry:s)
  %+  turn  
    entries
  |=(=entry:s hash.entry)
++  get-listings
  |=  l=(list hash)
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
    =.  phonetics
      %-  
      %-  ~(uno by phonetics)
        %-  malt
        %+  turn  keys
        |=  =key:s
        [(utter:m key) (silt ~[key])]
      |=  [k=key:s v=(set key:s) w=(set key:s)]
      (~(uni in v) w)
    di-core
  --
--