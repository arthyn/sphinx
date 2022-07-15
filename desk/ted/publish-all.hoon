/-  spider
/-  s=sphinx
/+  *strandio
=,  strand=strand:spider
=/  posts
  ^-  (list declare:s)
  :~  :-  %friends
        ['networked subject' %group 'web+urbitgraph://group/~matwet/networked-subject' 'https://subject.network | networked subject' ~['hosting' 'networking' 'urbit' 'ops'] 'https://urbits3.ams3.digitaloceanspaces.com/sitful-hatred/2022.7.07..17.15.52-ns.png']
      :-  %friends
          ['Hooniverse' %group 'web+urbitgraph://group/~hiddev-dannut/new-hooniverse' 'Community based Hoon learning for all levels. For discussion of Hoon specific to Uqbar, join ~hiddev-dannut/uhoon' ~['hoon' 'dev' 'urbit' 'programming' 'education'] 'https://i.imgur.com/ghThlz7.png']
      :-  %friends
          ['Hollow Mars Theory' %group 'web+urbitgraph://group/~rabsef-bicrym/hollow-mars-theory' 'Definitely NOT a Conspiracy Chat' ~['conspiracies' 'ufos' 'steel beams'] '']
      :-  %friends
          ['celestial systems' %group 'web+urbitgraph://group/~nocsyx-lassul/celestial-systems' 'A place for pilots who are building hosting providers' ~['hosting' 'ops' 'urbit'] '']
      :-  %friends
          ['Structure' %group 'web+urbitgraph://group/~fabled-faster/structure' 'Urbit Structural Design and Engineering Group. Always Thinking About Mechanics.' ~['design' 'ux' 'hci' 'urbit'] 'https://fabled-faster.nyc3.digitaloceanspaces.com/fabled-faster/2022.1.27..17.59.43-image.png']
      :-  %friends
          ['The Marketplace' %group 'web+urbitgraph://group/~tirrel/the-marketplace' 'Welcome to The Marketplace, featuring The Pit, Urbit\'s first open-outcry market!' ~['urbit' 'market' 'sell' 'buy'] 'https://snipboard.io/U0IYyi.jpg']
      :-  %friends
          ['The Forge' %group 'web+urbitgraph://group/~middev/the-forge' 'pale fire computing' ~['dev' 'programming' 'hoon' 'urbit'] 'https://nyc3.digitaloceanspaces.com/archiv/littel-wolfur/2021.5.06..21.01.58-the%20forge.png']
      :-  %friends
          ['UFORIA' %group 'web+urbitgraph://group/~tiplec-lacnyx/ufora' 'UFO Research, Investigations, and Analysis' ~['UFO' 'conspiracies' 'research'] 'https://tiplec-lacnyx.nyc3.digitaloceanspaces.com/tiplec-lacnyx/2021.12.27..06.09.47-change1.jpg']
      :-  %friends
          ['Urbit Community' %group 'web+urbitgraph://group/~bitbet-bolbel/urbit-community' 'World hub, help desk, meet and greet, etc.' ~['general' 'urbit' 'community' 'help'] 'https://fabled-faster.nyc3.digitaloceanspaces.com/fabled-faster/2021.4.02..21.52.41-UC.png']
      :-  %friends
          ['Urbytes' %group 'web+urbitgraph://group/~nartes-fasrum/urbytes' 'We feed and water Mars.' ~['cooking' 'food' 'beverages' 'peanut butter eggs'] '']
  ==
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
;<  our=@p   bind:m  get-our
;<  ~  bind:m
  %-  send-raw-cards
  ^-  (list card:agent:gall)
  %+  turn
    posts
  |=  =declare:s
  [%pass /poke %agent [our %sphinx] %poke [%declare !>(declare)]]
(pure:m !>(~))