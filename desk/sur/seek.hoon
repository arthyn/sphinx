|%
+$  key   @t    :: keyword that points to listings
+$  hash  @uw  :: @uw version of shax result 
+$  rank  @ud  :: @ud representing priority of listing
::
:: an entry points to a listing hash and provides
:: a semblance of priority for the listing
::
+$  entry     
  $:  =hash   :: hash of listing contents
      =rank   :: based on which attribute keyword came from
  ==
::
:: a listing represents a search result which points to some
:: external resource through a link. this is a rich result
:: which gives a summary of the resource as well as an image
:: and related topics.
::
:: each listing has a source and time so that they can be updated
:: via the source requesting to replace the listing and hash 
::
+$  listing
  $:  title=@t
      link=@t
      description=@t
      tags=(list @t)
      image=@t
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
+$  notice  (pair hash listing)
--