import { amenityHighlightsFrom, perfectForTagsFromCards, splitLegacyPerfectFor } from "@/lib/villaDetailData";

const tranquilPerfectForCards = [
    {
      title: "Grand Weddings",
      image: "/Villa_Retreats/Tranquil Woods/4-Perfect For/Grand Weddings.webp",
    },
    {
      title: "Private Celebrations",
      image:
        "/Villa_Retreats/Tranquil Woods/4-Perfect For/Private Celebrations.webp",
    },
    {
      title: "Weekend Getaways",
      image:
        "/Villa_Retreats/Tranquil Woods/4-Perfect For/Weekend Getaways.webp",
    },
    {
      title: "Staycations",
      image: "/Villa_Retreats/Tranquil Woods/4-Perfect For/Staycations.webp",
    },
  ];

const tranquilBase = {
  id: "tranquil",
  name: "Tranquil Woods",
  type: "LUXURY GARDEN RETREAT · WEDDING VENUE",
  location: "Kanakapura Road · South Bangalore",
  stats: {
    stay: "15 Guests",
    events: "500 Guests",
    bhk: "2 BHK",
    lawn: "Multi-layered Garden",
    villaArea: "Glass-walled Living Areas",
  },
  description:
    "Tranquil Woods is a 2-bedroom private pool villa within an expansive multi-layered garden layout. Close to the Art of Living International Centre, the property features glass-walled living areas and undulating lawns. Designed for both overnight luxury stays and large-format weddings and events, it holds capacity for up to 500 guests in its outdoor event spaces while offering intimate villa living for smaller groups.",
  perfectForCards: tranquilPerfectForCards,
  perfectForTags: perfectForTagsFromCards(tranquilPerfectForCards),
  categories: ["Weddings", "Pre-wedding", "Luxury Stays", "Nature Retreats"],
  thumbnail: "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
  image: "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
  images: [
    "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
    "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 2.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/Villa 1 Entrance 2.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/Private Pool Villa.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/Amphitheater.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/walkway.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/Villa Bedroom 1.webp",
    "/Villa_Retreats/Tranquil Woods/2-Spaces/lawn area.webp",
  ],
  amenities: [
    { label: "Private Pool", icon: "Waves" },
    { label: "Airconditioned Interiors", icon: "Wind" },
    { label: "Outdoor Seating", icon: "Sofa" },
    { label: "Glasshouse Living Area", icon: "Home" },
    { label: "Entertainment Systems", icon: "Music" },
    { label: "Bonfire Setup", icon: "Flame" },
    { label: "Barbecue Setup", icon: "Utensils" },
    { label: "Dry Kitchen", icon: "Kitchen" },
    { label: "Ample Parking", icon: "Car" },
    { label: "Tableware & Utensils", icon: "Coffee" },
  ],
  propertyDetails: [
    {
      label: "1.5 Acre",
      description: "Landscaped Lawn",
      icon: "Trees",
    },
    {
      label: "Glasshouse",
      description: "Living Space",
      icon: "Home",
    },
    {
      label: "Multi-level",
      description: "Garden Venue",
      icon: "Layers",
    },
    {
      label: "2 Gazebos",
      description: "Outdoor Setups",
      icon: "Tent",
    },
    {
      label: "Kids Play",
      description: "Area",
      icon: "Smile",
    },
    {
      label: "Large Pool",
      description: "With Lawn View",
      icon: "Waves",
    },
    {
      label: "Outdoor Bar",
      description: "Counter Setup",
      icon: "Wine",
    },
  ],
  services: [
    {
      title: "Chef on Call",
      description:
        "Private chef service for curated meals and large-scale event catering.",
      footer: "Available on request. Additional charges apply",
      icon: "ChefHat",
    },
    {
      title: "Butler Service",
      description: "On-site hospitality support for seamless stays and events.",
      footer: "Available on request. Additional charges apply",
      icon: "User",
    },
    {
      title: "Pick-up & Drop",
      description: "Transport support available for guest logistics.",
      footer: "Confirmed during booking",
      icon: "Car",
    },
    {
      title: "Event Setup Support",
      description:
        "Full-scale event coordination for weddings, corporate events, and celebrations.",
      footer: "Available on request",
      icon: "PartyPopper",
    },
  ],
  activities: [
    {
      title: "Bonfire",
      image: "/Villa_Retreats/Tranquil Woods/3-Experiences/Bonfire.webp",
    },
    {
      title: "High Tea",
      image: "/Villa_Retreats/Tranquil Woods/3-Experiences/High Tea.webp",
    },
    {
      title: "Picnic Setup",
      image: "/Villa_Retreats/Tranquil Woods/3-Experiences/Picnic Setup.webp",
    },
    {
      title: "Barbeque",
      image: "/Villa_Retreats/Tranquil Woods/3-Experiences/bbbbq.webp",
    },
    {
      title: "Movie Under The Stars",
      image:
        "/Villa_Retreats/Tranquil Woods/3-Experiences/movie under the stars.webp",
    },
    {
      title: "Floating Breakfast",
      image: "/Villa_Retreats/Tranquil Woods/3-Experiences/floatinbf.webp",
    },
  ],
  spaces: [
    {
      name: "Garden Lawn",
      image: "/Villa_Retreats/Tranquil Woods/Spaces/spaces_01.webp",
    },
    {
      name: "Glass Villa Living",
      image: "/Villa_Retreats/Tranquil Woods/Spaces/spaces_02.webp",
    },
    {
      name: "Private Pool",
      image: "/Villa_Retreats/Tranquil Woods/Spaces/spaces_03.webp",
    },
    {
      name: "Event Grounds",
      image: "/Villa_Retreats/Tranquil Woods/Spaces/spaces_04.webp",
    },
  ],
  categorizedSpaces: [
    {
      id: "garden-lawn",
      title: "Garden Lawn",
      category: "Outdoors",
      amenities: [
        "Private pool access",
        "Garden sit-out",
        "Bonfire zone",
        "Barbecue setup",
      ],
      images: [
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_01.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_02.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_03.webp",
      ],
    },
    {
      id: "glass-villa-living",
      title: "Glass Villa Living",
      category: "Indoors",
      amenities: [
        "Comfortable seating",
        "Ambient lighting",
        "Air conditioning",
        "Entertainment setup",
      ],
      images: [
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_02.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_04.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_05.webp",
      ],
    },
    {
      id: "private-pool",
      title: "Private Pool",
      category: "Outdoors",
      amenities: [
        "Private pool access",
        "Garden sit-out",
        "Bonfire zone",
        "Barbecue setup",
      ],
      images: [
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_03.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_06.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_07.webp",
      ],
    },
    {
      id: "event-grounds",
      title: "Event Grounds",
      category: "Indoors",
      amenities: [
        "Comfortable seating",
        "Ambient lighting",
        "Air conditioning",
        "Entertainment setup",
      ],
      images: [
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_04.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_08.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_09.webp",
      ],
    },
    {
      id: "additional-spaces",
      title: "Additional Spaces",
      category: "Outdoors",
      amenities: ["Expansive views", "Open area"],
      images: [
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_10.webp",
        "/Villa_Retreats/Tranquil Woods/Spaces/spaces_11.webp",
      ],
    },
  ],
  pricing: {
    stay: {
      title: "Stay Experience",
      subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
      packages: [
        {
          label: "Up to 20 PAX",
          sublabel: "≈ ₹2,175 / head",
          price: "₹43,500 + taxes",
        },
        { label: "Additional Guest", price: "₹1,999 + taxes" },
      ],
      features: [
        "Full venue access",
        "Overnight villa stay",
        "Complimentary breakfast",
      ],
    },
    event: {
      title: "Event Experience",
      subtitle: "8 hours (2 PM · 12 AM)",
      packages: [
        {
          label: "Up to 30 PAX",
          sublabel: "≈ ₹1,450 / head",
          price: "₹43,500 + taxes",
        },
        { label: "Additional Guest", price: "₹1,999 + taxes" },
      ],
      features: ["Private venue access", "Complimentary high tea"],
    },
  },
  locationDetails: {
    mapImage: "",
    address: "Kanakapura Main Rd, Badamanavarathekaval, Bangalore — 560082",
    distance: "Approximately 45 minutes from Bangalore City Center",
    nearby: [
      { label: "ART OF LIVING", distance: "5 mins away" },
      { label: "FORUM MALL", distance: "20 mins away" },
      { label: "BANNERGHATTA NATIONAL PARK", distance: "30 mins away" },
    ],
  },
  video: {
    youtubeUrl: "https://www.youtube.com/watch?v=KHJFdAVRmF8",
    thumbnail: "/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp",
    duration: "2:51",
  },
  faq: [
    {
      question: "How many guests can stay overnight?",
      answer: "Up to 10-15 guests can be accommodated.",
    },
    {
      question: "Is the property suitable for weddings?",
      answer:
        "Yes, the property supports large-format weddings and outdoor events.",
    },
    {
      question: "What is the event capacity?",
      answer: "The venue can accommodate approximately 100 to 500 guests.",
    },
    {
      question: "Is the pool private?",
      answer: "Yes, the pool is exclusively accessible to guests.",
    },
    {
      question: "Is food included?",
      answer: "Meals can be arranged on request.",
    },
  ],
};

export const tranquil = {
  ...tranquilBase,
  amenityHighlights: amenityHighlightsFrom(tranquilBase.amenities),
};
