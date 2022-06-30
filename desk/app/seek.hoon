/-  s=seek
/+  default-agent, verb, dbug
/+  *seek
/+  sift
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  +$  state-0
    $:  %0
        =lookup:s
        =trail:s
        =directory:s
        published=directory:s
    ==
  --
=|  state-0
=*  state  -
=<
  %+  verb  &
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
      %directory-notice
    =+  !<(=notice:s vase)
    (publish notice)
  ==
  ++  publish
    |=  =notice:s
    ^+  cor
    ?>  =(src.bowl source.q.notice)
    ?>  =(p.notice (digest q.notice))
    di-abet:(di-init:(di-abed:di-core p.notice) q.notice)
  --
::
++  watch
  |=  =path
  ^+  cor
  cor
++  agent
  |=  [=wire =sign:agent:gall]
  ^+  cor
  cor
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ~&  arvo/wire
  cor
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
      [%x %lookup @ ~]  
    =-  ``listings+!>(-)
    ^-  (list listing:s)
    %+  turn
      %+  turn  
        %+  sort  (~(gut by lookup) i.t.t.path *(list entry:s))
        |=  [a=entry:s b=entry:s]
        (gte rank.a rank.b)
      |=(=entry:s hash.entry)
    |=  =hash:s
    (~(got by directory) hash)
  ::
  ==
::
++  from-self  =(our src):bowl
++  di-core
  |_  [=listing:s =hash:s]
  ++  di-core  .
  ++  di-abet
    cor(directory (~(put by directory) hash listing))
  ++  di-abed
    |=  h=hash:s
    di-core(hash h, listing (~(gut by directory) h *listing:s))
  ++  di-init
    |=  l=listing:s
    =.  listing  l
    =/  entries=lookup:s
      %-  malt
      %-  zing
      :~  ~[[title.l ~[[hash rank=0]]]]
          %+  turn
            tags.l
          |=  tag=@t
          [tag ~[[hash rank=1]]]
          %+  turn
            (sift:sift description.l)
          |=  word=@t
          [word ~[[hash rank=2]]]
      ==
    ~&  -:!>(entries)
    ~&  -:!>(lookup)
    =.  lookup      
      %-  ~(uni by entries)
      %-  ~(rut by lookup)
      |=  [=key:s value=(list entry:s)]
      ?.  (~(has by entries) key)  value
      (weld value (~(got by entries) key))
    di-core
  --
--