/-  s=sphinx
/+  *sphinx, *sift
:-  %say
|=  $:  [now=@da eny=@uv =beak]
        [[word=@t algo=?(%all %exact %phonetic %ngram) ~] ~]
    ==
=/  our  (scot %p p.beak)
=/  wen  (scot %da now)
=/  state=state:s  .^(state:s /gx/[our]/sphinx/[wen]/state/noun)
=/  title   (norm:sift word)  :: full query
=/  parts   (sift:sift word)  :: split query
=/  index   ~(. delver index.state)
=/  lookup
  ?-  algo
      %all        get-entries.index
      %exact      get-exact.index
      %ngram      get-trigrams.index
      %phonetic   get-phonetics.index
  ==
=/  title-entries=(list entry:s)  
  %+  turn
    (lookup title)
  (uprank 10)
=/  entries=(list entry:s)
  %-  sum-ranks.index
  %-  zing
  %+  turn
    parts
  |=  word=@t
  (lookup word)
:-  %noun
%+  turn
  ?:  =(algo %all)  (lookup word)
  (welp entries title-entries)
|=  [=hash:s =rank:s]
=/  listing  (~(got by directory.state) hash)
[rank title.post.listing hash]
