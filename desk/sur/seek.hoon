|%
+$  key   @t    :: keyword that points to listings
+$  hash  @uv  :: @uv version of shax result 
+$  rank  @ud  :: @ud representing priority of listing
+$  trigram  @t  :: @t consisting of three characters taken from a word
::
:: an entry points to a listing hash and provides
:: a semblance of priority for the listing
::
+$  entry     
  $:  =hash   :: hash of listing contents
      =rank   :: based on which attribute keyword came from
  ==
::
:: a post represents a search result which points to some
:: external resource through a link. this is a rich result
:: which gives a summary of the resource as well as an image
:: and related topics.
::
+$  post-type  ?(%app %group %content %other)
::
+$  post
  $:  title=@t
      type=post-type
      link=@t
      description=@t
      tags=(list @t)
      image=@t
  ==
::
:: a listing includes the content of the post as well as information
:: that would affect the hash so are left out, namely time, source and 
:: hash. each post has a source and time so that they can be updated
:: via the source requesting to replace the listing and hash.
::
::
+$  reach  ?(%private %friends %public)
::
+$  listing
  $:  =post
      =hash
      =reach
      source=@p 
      time=@da 
  ==
::
:: lookup acts as a search index for keywords, each key points to
:: an entry which points to a listing. listings are separate from 
:: the lookup because they are repeated under different keys
:: 
+$  lookup  (map key (list entry))
::
::  trigrams act as a way to account for spelling errors. we keep a map
::  of trigram to set of lookup keys. we take the query's trigrams and
::  count how many times a particular key comes up.
+$  trigrams  (map trigram (set key))
::
:: trail is a way for us to know all the keys required to update 
:: a listing with the new hash of it's contents
::
+$  trail   (map hash (list key))
::
:: directory is a hash table of all current listings. each hash is
:: created by taking the hash of the entire listings contents.
::
+$  directory  (map hash listing)
::
+$  search
  $:  listings=(list listing)
      start=@ud
      limit=@ud
      size=@ud
      total=@ud
  ==
::
--