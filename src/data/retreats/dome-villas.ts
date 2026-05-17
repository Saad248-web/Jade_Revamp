import {
  DOME_COLOR_META,
  type DomeColorKey,
} from "@/lib/domeVillaIds";
import { DOME_VIDEO_URLS } from "@/lib/videoUtils";

const BLUE_DOME_IMAGES = [
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 1.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 3.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 4.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 5.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/1st_Floor_sit_out.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Bed-Room_1.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Bed_Room_2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Bed_Room_3.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Bed_Room_Hill_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Blue_Dome.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Dome_Side_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Glamping_Experince.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Hill_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Lawn_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Living_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/OutDoor_Sit_Out.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Private_Plunge_Pool.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Walk_way.webp",
];

const RED_DOME_IMAGES = [
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 1.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 3.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 4.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 5.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 6.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Bath_Tub.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Bed_Room_1.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Bed_Room_2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Bed_Room_3.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Entrance.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Exit.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Front_Yard.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Hobbit_Hole_Window.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Hobbit_Hole_entrance.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Kids_Pool.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Lawn_area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Living_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/OutDoor_Sit_Out.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Pool.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Pool_Side_Sit_Out.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Pool_with_Hill_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Semi_Open_Dining_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Wall_Unit_Artifacts.webp",
];

const YELLOW_DOME_IMAGES = [
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Hero/Hero_evening_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Hero/hero.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Bed_Room_.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Bed_Room_1.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Bed_Room_2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Corridor_Walk_way.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Dining_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Greek_Style_Bath.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Inner_Court_Yard_Entrance.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Inner_Court_Yard_Entrance_2.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Living_Area.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Living_Area_Hobbit_Hole.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Living_Area_entrance.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Master_Bed_Room.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Master_Bed_Room_Night_View.webp",
  "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Patio_Sit_Out.webp",
];

export const DOME_GROUP_AMENITIES = [
  "Comfortable seating",
  "Ambient lighting",
  "Air conditioning",
  "Entertainment setup",
];

export const domeVillas = {
  id: "dome-villas",
  name: "Dome Villas",
  type: "HOBBIT THEMED VILLA RETREAT",
  location: "Shoolagiri · Near Bangalore",
  stats: {
    stay: "18 Guests",
    events: "25 Guests",
    bhk: "3 Villas",
    lawn: "Landscaped Pathways",
    villaArea: "Private Estate",
  },
  description:
    "Dome Villas is a private estate with three independent dome-shaped villas, booked exclusively by one group. The Hobbit-themed design features distributed living spaces, landscaped pathways connecting each dome, and a private plunge pool. Each dome has its own bedroom, bath, and sit-out area, offering a unique blend of fantasy architecture and nature immersion suited for small groups and intimate celebrations.",
  perfectFor: [
    {
      title: "Pool Parties",
      image: "/Villa_Retreats/Dome/Perfect For/Pool Parties.webp",
    },
    {
      title: "Group Getaways",
      image: "/Villa_Retreats/Dome/Perfect For/Group Getaways.webp",
    },
    {
      title: "Nature Stays",
      image: "/Villa_Retreats/Dome/Perfect For/Nature Stays.webp",
    },
    {
      title: "Intimate Weddings",
      image: "/Villa_Retreats/Dome/Perfect For/Intimate Weddings.webp",
    },
  ],
  categories: ["Nature Retreats", "Weekend Getaways", "Luxury Stays"],
  thumbnail: "/Villa_Retreats/Dome/Hero Main/Hero 1.webp",
  image: "/Villa_Retreats/Dome/Hero Main/Hero 1.webp",
  images: [
    "/Villa_Retreats/Dome/Hero Main/Hero 1.webp",
    "/Villa_Retreats/Dome/Hero Main/Hero 2.webp",
    ...BLUE_DOME_IMAGES,
    ...RED_DOME_IMAGES,
    ...YELLOW_DOME_IMAGES,
  ],
  amenities: [
    { label: "Private Pool", icon: "Waves" },
    { label: "Airconditioned Interiors", icon: "Wind" },
    { label: "Outdoor Seating", icon: "Sofa" },
    { label: "Jacuzzi", icon: "Waves" },
    { label: "Entertainment Systems", icon: "Music" },
    { label: "Bonfire Setup", icon: "Flame" },
    { label: "Barbecue Setup", icon: "Utensils" },
    { label: "Fully Functional Kitchen", icon: "Kitchen" },
    { label: "LCD Television", icon: "Tv" },
    { label: "Tableware & Utensils", icon: "Coffee" },
    { label: "Power Backup", icon: "Zap" },
    { label: "Parking", icon: "Car" },
  ],
  propertyDetails: [
    {
      label: "Three Dome Villas (Private Estate)",
      description:
        "Entire property includes three independent villas booked together.",
      icon: "Building",
    },
    {
      label: "Distributed Living Layout",
      description:
        "Bedrooms and living spaces spread across multiple structures.",
      icon: "Layout",
    },
    {
      label: "Private Plunge Pool",
      description: "Outdoor pool accessible to all guests within the estate.",
      icon: "Waves",
    },
    {
      label: "Landscaped Garden Property",
      description: "Connected pathways and outdoor zones across the property.",
      icon: "Trees",
    },
    {
      label: "Multiple Sit-out Areas",
      description: "Dedicated outdoor seating, swings, and relaxation zones.",
      icon: "Sofa",
    },
    {
      label: "Exclusive Use Property",
      description: "Not shared with other guests during the stay.",
      icon: "Lock",
    },
  ],
  services: [
    {
      title: "Chef on Call",
      description: "Private chef for curated meals across the estate.",
      footer: "Available on request. Additional charges apply",
      icon: "ChefHat",
    },
    {
      title: "Butler Service",
      description: "On-site support for group logistics and event management.",
      footer: "Available on request. Additional charges apply",
      icon: "User",
    },
    {
      title: "Pick-up & Drop",
      description: "Transport support for guest arrivals and departures.",
      footer: "Confirmed during booking",
      icon: "Car",
    },
    {
      title: "Event Setup Support",
      description:
        "Assistance with decor and arrangements for small celebrations.",
      footer: "Available on request",
      icon: "PartyPopper",
    },
  ],
  activities: [
    {
      title: "Barbecue Experiences",
      description: "Self-use grill setups for group cooking.",
      image: "/Villa_Retreats/Dome/3-Experienceee/barbeque.webp",
    },
    {
      title: "Bonfire Evenings",
      description: "Outdoor bonfire for gatherings.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Bonfire.webp",
    },
    {
      title: "Movie Under The Stars",
      description: "Projector-based viewing experience.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Movie Under The Stars.webp",
    },
    {
      title: "Candlelit Dining",
      description: "A private dining setup under warm lights.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Candlelit Dining.webp",
    },
    {
      title: "Picnic Setup",
      description: "Curated picnic moments in the garden.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Picnic Setup.webp",
    },
    {
      title: "Floating Breakfast",
      description: "Breakfast served in the pool for a relaxed start.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Floating Breakfast.webp",
    },
    {
      title: "Outdoor Activities",
      description: "Open-air games and group-friendly activities.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Outdoor Activities.webp",
    },
    {
      title: "Indoor Games",
      description: "Board games and indoor entertainment for groups.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Indoor Games.webp",
    },
    {
      title: "High Tea",
      description: "Evening tea with light bites in a cozy setting.",
      image: "/Villa_Retreats/Dome/3-Experienceee/High Tea.webp",
    },
    {
      title: "Zen Garden",
      description: "Quiet outdoor corners for slow, peaceful time.",
      image: "/Villa_Retreats/Dome/3-Experienceee/Zen Garden.webp",
    },
  ],
  spaces: [
    {
      name: "Blue Dome",
      image: BLUE_DOME_IMAGES[0],
    },
    {
      name: "Red Dome",
      image: RED_DOME_IMAGES[0],
    },
    {
      name: "Yellow Dome",
      image: YELLOW_DOME_IMAGES[0],
    },
  ],
  categorizedSpaces: [
    {
      id: "blue-dome",
      title: "Blue Dome",
      category: "Blue Dome",
      amenities: DOME_GROUP_AMENITIES,
      images: BLUE_DOME_IMAGES,
    },
    {
      id: "red-dome",
      title: "Red Dome",
      category: "Red Dome",
      amenities: DOME_GROUP_AMENITIES,
      images: RED_DOME_IMAGES,
    },
    {
      id: "yellow-dome",
      title: "Yellow Dome",
      category: "Yellow Dome",
      amenities: DOME_GROUP_AMENITIES,
      images: YELLOW_DOME_IMAGES,
    },
  ],
  pricing: {
    stay: {
      title: "Stay Experience",
      subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
      packages: [
        {
          label: "Up to 4 PAX",
          sublabel: "≈ ₹3,750 / head",
          price: "₹14,999 + taxes",
        },
        { label: "Additional Guest", price: "₹1,999 + taxes" },
      ],
      features: ["Full estate access", "All 3 domes", "Pool access"],
    },
    event: {
      title: "Event Experience",
      subtitle: "8 hours (2 PM · 12 AM)",
      packages: [
        {
          label: "Up to 8 PAX",
          sublabel: "≈ ₹1,875 / head",
          price: "₹14,999 + taxes",
        },
        { label: "Additional Guest", price: "₹1,099 + taxes" },
      ],
      features: ["Private venue access", "Parking included"],
    },
  },
  locationDetails: {
    mapImage: "",
    address: "Chinnapathirali Village, Shoolagiri, Tamil Nadu 635105",
    distance: "Approximately 45 minutes from Sarjapur",
    nearby: [
      { label: "MAKALI DURGA", distance: "15 mins away" },
      { label: "HALU CHILUME", distance: "15 mins away" },
      { label: "SUNSET VIEW POINT", distance: "30 mins away" },
    ],
  },
  video: {
    youtubeUrl: "https://www.youtube.com/watch?v=k0-1rTGdowk",
    thumbnail: "",
    duration: "1:21",
  },
  faq: [
    {
      question: "Is the property shared with other guests?",
      answer:
        "The full Dome Villas estate is booked exclusively for one group, including all three domes.",
    },
    {
      question: "How many villas are included?",
      answer:
        "The property includes three dome villas within one private estate.",
    },
    {
      question: "How many guests can stay overnight?",
      answer: "Up to 18 guests can be accommodated.",
    },
    {
      question: "Is the pool private?",
      answer: "Yes, the plunge pool is exclusively accessible to guests.",
    },
    {
      question: "Are meals included?",
      answer: "Meals can be arranged on request.",
    },
  ],
};

const DOME_IMAGES_BY_COLOR: Record<DomeColorKey, string[]> = {
  blue: BLUE_DOME_IMAGES,
  red: RED_DOME_IMAGES,
  yellow: YELLOW_DOME_IMAGES,
};

function heroImagesForColor(images: string[]): string[] {
  const heroes = images.filter((u) => u.includes("/Hero/"));
  return heroes.length > 0 ? heroes : images.slice(0, 5);
}

function buildSingleDomeVilla(color: DomeColorKey) {
  const meta = DOME_COLOR_META[color];
  const colorImages = DOME_IMAGES_BY_COLOR[color];
  const heroes = heroImagesForColor(colorImages);
  const categorized = domeVillas.categorizedSpaces.filter(
    (g) => g.category === meta.categoryLabel,
  );

  const {
    id: _id,
    name: _name,
    images: _images,
    thumbnail: _thumb,
    image: _image,
    spaces: _spaces,
    categorizedSpaces: _cats,
    video: _video,
    propertyDetails: _pd,
    description: _desc,
    faq: _faq,
    ...shared
  } = domeVillas;

  return {
    ...shared,
    id: meta.id,
    name: meta.name,
    description: `The ${meta.shortLabel} is one of three Hobbit-themed dome villas at the Dome Villas private estate near Bangalore. Book the full estate for exclusive use of all three domes, or explore this dome’s spaces, pool areas, and landscaped sit-outs in detail below.`,
    thumbnail: heroes[0] ?? colorImages[0],
    image: heroes[0] ?? colorImages[0],
    images: colorImages,
    spaces: [{ name: meta.shortLabel, image: colorImages[0] }],
    categorizedSpaces: categorized,
    propertyDetails: [
      {
        label: meta.shortLabel,
        description:
          "A standalone dome villa within the private Dome Villas estate, with its own bedroom, bath, and outdoor sit-out.",
        icon: "Building",
      },
      {
        label: "Hobbit-Themed Architecture",
        description:
          "Curved forms, warm interiors, and nature-forward design unique to this dome.",
        icon: "Layout",
      },
      {
        label: "Pool & Outdoor Living",
        description:
          "Access to estate pool zones and landscaped outdoor areas (full-estate booking).",
        icon: "Waves",
      },
      {
        label: "Landscaped Grounds",
        description:
          "Pathways and garden zones connect this dome to the wider estate.",
        icon: "Trees",
      },
      {
        label: "Exclusive Estate Booking",
        description:
          "The three domes are reserved together for one group — not shared with other guests.",
        icon: "Lock",
      },
    ],
    video: {
      youtubeUrl: DOME_VIDEO_URLS[color],
      thumbnail: "",
      duration: "1:21",
    },
    faq: [
      {
        question: "Can I book only this dome?",
        answer:
          "Dome Villas is booked as a private estate with all three domes for one group. This page showcases the spaces and layout of this dome.",
      },
      {
        question: "How many guests can the estate accommodate?",
        answer: "Up to 18 guests can be accommodated across all three domes.",
      },
      {
        question: "Is the pool private?",
        answer:
          "Yes, pool and outdoor areas are for guests of the exclusively booked estate.",
      },
      {
        question: "Are meals included?",
        answer: "Meals can be arranged on request.",
      },
    ],
  };
}

export const blueDomeVilla = buildSingleDomeVilla("blue");
export const redDomeVilla = buildSingleDomeVilla("red");
export const yellowDomeVilla = buildSingleDomeVilla("yellow");

export const DOME_VILLA_VARIANTS = [
  blueDomeVilla,
  redDomeVilla,
  yellowDomeVilla,
] as const;
