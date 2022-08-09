|%
++  utter
  |=  corpus=@t
  ^-  @t
  =/  norm  (cuss (trip corpus))
  ?:  =(norm '')  ''
  ~(phone core [norm *tape 0])
++  core
  |_  [text=tape chars=tape index=@ud]
  ++  phone
    ?:  =(current 'A')
      ?:  =(next 'E')  (jump2 'E')
      (jump 'A')
    ?:  
      ?&  =(next 'N')
          ?|  =(current 'G')
              =(current 'K')
              =(current 'P')
          ==
      ==
      (jump2 'N')
    ?:  =(current 'W')
      ?:  =(next 'R')           (jump2 'R')
      ?:  =(next 'H')           (jump2 current)
      ?:  (vowel next)          (jump2 'W')
      recite
    ?:  =(current 'X')  (jump 'S')
    ?:
      ?|  =(current 'E')
          =(current 'I')
          =(current 'O')
          =(current 'U')  
      ==
      (jump current)
    recite
  ++  recite
    ?:  (gte index (lent text))
      (crip chars)
    ::  B -> B unless in MB
    ?:  &(=(current 'B') !=(prev 'M'))
      (jump 'B')
    :: 'sh' if -CIA- or -CH, but not SCH, except SCHW (SCHW is handled in S)
    ::  S if -CI-, -CE- or -CY- dropped if -SCI-, SCE-, -SCY- (handed in S)
    ::  else K
    ?:  =(current 'C')
      ?:  (soft next)
        :: C[IEY]
        ?:  &(=(next 'I') =((at 2 &) 'A'))
          :: CIA
          (jump sh)
        ?:  !=(prev 'S')
          (jump 'S')
        advance
      ?:  =(next 'H')
        (jump2 sh)
      (jump 'K')
    ::  J if in -DGE-, -DGI- or -DGY-, else T
    ?:  =(current 'D')
      ?:  &(=(next 'G') (soft (at 2 &)))
        (jump2 'J')
      (jump 'T')
    ::  F if in -GH and not B--GH, D--GH, -H--GH, -H---GH
    ::  else dropped if -GNED, -GN,
    ::  else dropped if -DGE-, -DGI- or -DGY- (handled in D)
    ::  else J if in -GE-, -GI, -GY and not GG
    ::  else K
    ?:  =(current 'G')
      ?:  =(next 'H')
        ?:  |(!(no-gh-to-f (at 3 |)) =((at 4 |) 'H'))
          (jump2 'F')
        advance
      ?:  =(next 'N')
        ?:  !&(=((at 2 &) 'E') =((at 3 &) 'D'))
          (jump 'K')
        advance
      ?:  &((soft next) !=(prev 'G'))
        (jump 'J')
      (jump 'K')
    ::  H if before a vowel and not after C,G,P,S,T
    ?:  &(=(current 'H') (vowel next) !(dipthong-h prev))
      (jump 'H')
    ::  Dropped if after C, else K
    ?:  &(=(current 'K') !=(prev 'C'))
      (jump 'K')
    ::  F if before H, else P
    ?:  =(current 'P')
      ?:  =(next 'H')
        (jump 'F')
      (jump 'P')
    ::  K
    ?:  =(current 'Q')
      (jump 'K')
    ::  'sh' in -SH-, -SIO- or -SIA- or -SCHW-, else S
    ?:  =(current 'S')
      ?:  &(=(next 'I') |(=((at 2 &) 'O') =((at 2 &) 'A')))
        (jump sh)
      ?:  =(next 'H')
        (jump2 sh)
      (jump 'S')
    ::  sh' in -TIA- or -TIO-, else 'th' before H, else T
    ?:  =(current 'T')
      ?:  &(=(next 'I') |(=((at 2 &) 'O') =((at 2 &) 'A')))
        (jump sh)
      ?:  =(next 'H')
        (jump2 th)
      ?:  !&(=(next 'C') =((at 2 &) 'H'))
        (jump 'T')
      advance
    ::  F
    ?:  =(current 'V')
      (jump 'F')
    ?:  &(=(current 'W') (vowel next))
      (jump 'W')
    ::  KS
    ?:  =(current 'X')
      (jump 'KS')
    ::  Y if followed by a vowel
    ?:  &(=(current 'Y') (vowel next))
      (jump 'Y')
    ::  S
    ?:  =(current 'Z')
      (jump 'S')
    ?:
      ?|  =(current 'F')
          =(current 'J')
          =(current 'L')
          =(current 'M')
          =(current 'N')
          =(current 'R')
      ==
      (jump current)
    advance
  ++  advance
    =.  index  +(index)
    recite   
  ++  jump
    |=  char=@t
    =.  chars  (snoc chars char)
    =.  index  +(index)
    recite
  ++  jump2
    |=  char=@t
    =.  chars  (snoc chars char)
    =.  index  (add index 2)
    recite
  ++  current   (snag index text)
  ++  next      
    ?:  (gte index (dec (lent text)))  ''
    (snag +(index) text)
  ++  prev
    ?:  (lte index 0)  ''
    (snag (dec index) text)
  ++  at
    |=  [offset=@ud forward=?]
    ?:  forward  
      ?:  (gth (add index offset) (dec (lent text)))  ''  
      (snag (add index offset) text)
    ?:  (lth index offset)  ''
    ?:  (lth (sub index offset) 0)  ''
    (snag (sub index offset) text)
  --
++  soft
  |=  char=@t
  ?|  =(char 'E')
      =(char 'I')
      =(char 'Y')
  ==
++  vowel
  |=  char=@t
  ?|  =(char 'A')
      =(char 'E')
      =(char 'I')
      =(char 'O')
      =(char 'U')
  ==
++  dipthong-h
  |=  char=@t
  ?|  =(char 'C')
      =(char 'G')
      =(char 'P')
      =(char 'S')
      =(char 'T')
  ==
++  no-gh-to-f
  |=  char=@t
  ?|  =(char 'B')
      =(char 'D')
      =(char 'H')
  ==
++  sh  'X'
++  th  '0'
--