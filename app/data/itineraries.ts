import type { ItineraryId } from '#shared/invitation/types'
export interface ItineraryStop {
  key: string
  type: 'lunch' | 'activity' | 'dinner'
  venue: string
  description: string
  address: string
  image?: string
  imagePosition?: string
  imageSource?: string
  imageCaption?: string
}
export interface ItineraryOption {
  id: ItineraryId
  label: string
  title: string
  route: string
  pace: string
  theme: 'luxury' | 'studio' | 'gallery'
  mood: string
  description: string
  highlights: string[]
  cover: ItineraryStop
  schedule: { time: string; plan: string }[]
  stops: ItineraryStop[]
}
export const itineraries: ItineraryOption[] = [
  {
    id: 'option-a',
    label: 'Option A',
    title: 'A Little Luxury',
    pace: 'City comforts · A little indulgence',
    theme: 'luxury',
    mood: 'POLISHED · COSY · EFFORTLESS',
    description:
      'Coffee to start, a film to get lost in, and a lovely dinner to linger over. A whole day just for us.',
    highlights: [
      'MRT ride & boutique browsing',
      'Luxury cinema',
      'Japanese–Italian dinner'
    ],
    route: 'MRT 16 Sierra → Tun Razak Exchange (TRX)',
    cover: {
      key: 'activity',
      type: 'activity',
      venue: 'Aurum Theatre',
      description:
        'Settle into luxury recliners for a film we both want to see.',
      address: 'Level 3, The Exchange TRX',
      image: 'images/itinerary/venues/aurum.webp',
      imageSource: 'https://www.gsc.com.my/cinemas/aurum-theatre/',
      imageCaption: 'Photo: GSC · Aurum Theatre, The Exchange TRX'
    },
    schedule: [
      {
        time: '11:00 AM',
        plan: 'Pick you up at Bandar 16 Sierra and head to MRT 16 Sierra'
      },
      {
        time: '11:15 AM',
        plan: 'Ride the MRT Putrajaya Line together to Tun Razak Exchange (TRX)'
      },
      {
        time: '12:00 PM',
        plan: 'A relaxed lunch at Kenny Hills Bakers On The Park'
      },
      {
        time: '1:30 PM',
        plan: 'Browse the boutiques together, with time for coffee'
      },
      {
        time: '3:30 PM',
        plan: 'A film at Aurum Theatre; timing follows the chosen screening'
      },
      {
        time: '7:00 PM',
        plan: 'Dinner at Hokkaido Table'
      },
      {
        time: '8:30 PM',
        plan: 'Take the MRT back to 16 Sierra, then head home together'
      },
      {
        time: '9:30–10:00 PM',
        plan: 'Drop you home'
      }
    ],
    stops: [
      {
        key: 'lunch',
        type: 'lunch',
        venue: 'Kenny Hills Bakers On The Park',
        description:
          'A relaxed lunch with coffee and pastries. We’ll request indoor seating.',
        address: 'The Exchange TRX · On The Park',
        image: 'images/itinerary/venues/kenny-trx.jpg',
        imageSource:
          'https://www.theexchange.my/dine/directory/kennyhillsbakersonthepark/',
        imageCaption: 'Photo: Kenny Hills Bakers On The Park / The Exchange TRX'
      },
      {
        key: 'activity',
        type: 'activity',
        venue: 'Aurum Theatre',
        description:
          'Settle into luxury recliners for a film we both want to see.',
        address: 'Level 3, The Exchange TRX',
        image: 'images/itinerary/venues/aurum.webp',
        imageSource: 'https://www.gsc.com.my/cinemas/aurum-theatre/',
        imageCaption: 'Photo: GSC · Aurum Theatre, The Exchange TRX'
      },
      {
        key: 'dinner',
        type: 'dinner',
        venue: 'Hokkaido Table',
        description:
          'Japanese–Italian dining to round off our day, all in the same mall.',
        address: 'Level 2, The Exchange TRX',
        image: 'images/itinerary/venues/hokkaido-prawns.jpg',
        imageSource: 'https://hokkaidotabletrx.com.my/',
        imageCaption: 'Photo: Hokkaido Table / GSC'
      }
    ]
  },
  {
    id: 'option-b',
    label: 'Option B',
    title: 'Made Together',
    pace: 'Hands-on moments · Time to connect',
    theme: 'studio',
    mood: 'PLAYFUL · PERSONAL · CREATIVE',
    description:
      'Make something a little imperfect, laugh a little, and make a memory that’s ours.',
    highlights: [
      'Pottery for two',
      'Coffee & conversation',
      'An unhurried dinner'
    ],
    route: 'A slow afternoon in Sri Hartamas',
    cover: {
      key: 'activity',
      type: 'activity',
      venue: 'Zen Ceramic Sri Hartamas',
      description:
        'A relaxed beginner-friendly pottery session. Make something personal, with no need to get it perfect.',
      address: 'Sri Hartamas, Kuala Lumpur',
      image: 'images/itinerary/venues/zen-workshop.webp',
      imageSource: 'https://zenceramic.asia/',
      imageCaption: 'Photo: Zen Ceramic · Workshop reference'
    },
    schedule: [
      {
        time: '11:00 AM',
        plan: 'Pick you up at Bandar 16 Sierra'
      },
      {
        time: '12:00 PM',
        plan: 'Lunch at Common Man Coffee Roasters, Desa Sri Hartamas'
      },
      {
        time: '2:00 PM',
        plan: 'A beginner-friendly pottery session at Zen Ceramic'
      },
      {
        time: '4:00 PM',
        plan: 'Coffee, dessert, and plenty of time to talk'
      },
      {
        time: '6:30 PM',
        plan: 'Dinner at Rock Salt, Sri Hartamas'
      },
      {
        time: '8:30 PM',
        plan: 'Head home together'
      },
      {
        time: '9:30–10:00 PM',
        plan: 'Drop you off at Bandar 16 Sierra'
      }
    ],
    stops: [
      {
        key: 'lunch',
        type: 'lunch',
        venue: 'Common Man Coffee Roasters',
        description:
          'Start with a relaxed lunch and coffee before our pottery session.',
        address: 'Desa Sri Hartamas, Kuala Lumpur',
        image: 'images/itinerary/venues/common-man-hartamas.png',
        imageSource:
          'https://www.commonmancoffeeroasters.com.my/pages/our-cafes',
        imageCaption: 'Photo: Common Man Coffee Roasters · Sri Hartamas'
      },
      {
        key: 'activity',
        type: 'activity',
        venue: 'Zen Ceramic Sri Hartamas',
        description:
          'A relaxed beginner-friendly pottery session. Make something personal, with no need to get it perfect.',
        address: 'Sri Hartamas, Kuala Lumpur',
        image: 'images/itinerary/venues/zen-workshop.webp',
        imageSource: 'https://zenceramic.asia/',
        imageCaption: 'Photo: Zen Ceramic · Workshop reference'
      },
      {
        key: 'dinner',
        type: 'dinner',
        venue: 'Rock Salt',
        description:
          'Wind down over an unhurried dinner together after our creative afternoon.',
        address: 'Sri Hartamas, Kuala Lumpur',
        image: 'images/itinerary/venues/rock-salt.jpg',
        imageSource: 'https://www.rocksalt.com.my/',
        imageCaption: 'Photo: Rock Salt Restaurant'
      }
    ]
  },
  {
    id: 'option-c',
    label: 'Option C',
    title: 'Textiles & Chinatown',
    pace: 'Heritage discoveries · A colourful evening',
    theme: 'gallery',
    mood: 'CULTURED · COLOURFUL · RELAXED',
    description:
      'A café lunch, beautiful textiles, and a colourful evening together in Chinatown.',
    highlights: [
      'Textiles & heritage',
      'A lingering coffee',
      'Dinner at Concubine'
    ],
    route: 'Merdeka 118 precinct → Chinatown',
    cover: {
      key: 'activity',
      type: 'activity',
      venue: 'Merdeka Textile Museum',
      description:
        'Explore Malay World textiles, intricate batik, and the stories woven into traditional dress.',
      address: 'Merdeka 118 Precinct, Jalan Merdeka, Kuala Lumpur',
      image: 'images/itinerary/venues/merdeka-textile-museum.jpg',
      imageSource: 'https://thesmartlocal.my/merdeka-textile-museum/',
      imageCaption: 'Photo: TheSmartLocal Malaysia · Merdeka Textile Museum'
    },
    schedule: [
      {
        time: '11:00 AM',
        plan: 'Pick you up at Bandar 16 Sierra'
      },
      {
        time: '12:00 PM',
        plan: 'Lunch at Leaf & Co., Jalan Sultan'
      },
      {
        time: '2:00 PM',
        plan: 'Explore the textiles and heritage galleries at Merdeka Textile Museum'
      },
      {
        time: '3:30 PM',
        plan: 'Settle in for coffee and conversation'
      },
      {
        time: '5:30 PM',
        plan: 'Head to Lorong Panggung for an evening in Chinatown'
      },
      {
        time: '6:30 PM',
        plan: 'Dinner at Concubine, Lorong Panggung'
      },
      {
        time: '8:30 PM',
        plan: 'Head home together'
      },
      {
        time: '9:30–10:00 PM',
        plan: 'Drop you off at Bandar 16 Sierra'
      }
    ],
    stops: [
      {
        key: 'lunch',
        type: 'lunch',
        venue: 'Leaf & Co.',
        description:
          'Start with coffee and a relaxed lunch in a characterful Chinatown heritage café.',
        address: '53, Jalan Sultan, Chinatown, Kuala Lumpur',
        image: 'images/itinerary/venues/leaf-and-co.jpg',
        imageSource:
          'https://where2go.com.my/kuala-lumpur/cafes/leaf-and-co-cafe/',
        imageCaption: 'Photo: Where2Go · Leaf & Co.'
      },
      {
        key: 'activity',
        type: 'activity',
        venue: 'Merdeka Textile Museum',
        description:
          'Explore Malay World textiles, intricate batik, and the stories woven into traditional dress.',
        address: 'Merdeka 118 Precinct, Jalan Merdeka, Kuala Lumpur',
        image: 'images/itinerary/venues/merdeka-textile-museum.jpg',
        imageSource: 'https://thesmartlocal.my/merdeka-textile-museum/',
        imageCaption: 'Photo: TheSmartLocal Malaysia · Merdeka Textile Museum'
      },
      {
        key: 'dinner',
        type: 'dinner',
        venue: 'Concubine',
        description:
          'Share contemporary Asian plates in a colourful Chinatown setting.',
        address: 'Lot 2, Lorong Panggung, Chinatown, Kuala Lumpur',
        image: 'images/itinerary/venues/concubine.jpg',
        imageSource: 'https://concubinekl.wixsite.com/klconcubine',
        imageCaption: 'Photo: Concubine KL'
      }
    ]
  }
]
