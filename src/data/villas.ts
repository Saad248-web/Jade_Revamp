import { Bed, Users, Home, MapPin } from "lucide-react";

export const VILLAS = [
  {
    id: "magnolia",
    name: "Magnolia",
    type: "CONTEMPORARY GLASS FARM VILLA",
    location: "Harohalli · Near Art of Living",
    stats: {
      stay: "10-30 Guests",
      events: "50-500 Guests",
      bhk: "3-2",
      lawn: "25,000 sqft",
      homeTheater: "12 Seater",
      villaArea: "7,000 sqft",
    },
    description:
      "A contemporary white multi-story villa with expansive glass windows and a large, lit swimming pool. The massive 25,000 sq ft landscaped lawn and professional catering services make it the perfect destination for your dream wedding or private gathering.",
    perfectFor: [
      "Wedding",
      "Staycation",
      "Corporate Retreats",
      "Celebrations",
      "Pre-wedding",
    ],
    spaces: [
      { name: "Lawn", image: "/assets/Jade_735_for_Desktop.png" },
      { name: "Poolside", image: "/assets/Jade_735_for_Desktop.png" }, // Placeholder
      { name: "Living Area", image: "/assets/Jade_735_for_Desktop.png" }, // Placeholder
    ],
    categories: ["Weddings", "Corporate Retreats", "Pre-wedding"],
    image: "/assets/Jade_735_for_Desktop.png",
    amenities: [
      {
        label: "Private Pool",
        icon: "Waves",
        description:
          "A private swimming pool exclusively for guests, with poolside seating and deck access",
      },
      {
        label: "Air-conditioned Interiors",
        icon: "Wind",
        description:
          "All rooms and common areas are fully air-conditioned for comfort throughout the stay.",
      },
      {
        label: "Outdoor Seating",
        icon: "Sun",
        description:
          "Multiple outdoor seating zones across the lawn and poolside for relaxation or gatherings.",
      },
      {
        label: "Entertainment Systems",
        icon: "Dribbble",
        description:
          "Entertainment systems are available in common areas, including indoor spaces.",
      },
      {
        label: "Home Theatre",
        icon: "Projector",
        description:
          "A dedicated home theater space designed for small groups. Suitable for private screenings.",
      },
      {
        label: "Bar Lounge",
        icon: "PartyPopper",
        description:
          "A bar-style lounge setup near the pool for casual gatherings and hosted evenings.",
      },
      {
        label: "Multipurpose Hall",
        icon: "Presentation",
        description:
          "An indoor hall that can be used as a meeting space, gathering area, or dorm-style rooms.",
      },
      {
        label: "Dry Kitchen",
        icon: "Home",
        description:
          "A dry kitchen equipped for light food preparation and serving.",
      },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        label: "Modern 3-Bedroom Glass Villa",
        description:
          "Large living and dining areas designed to overlook the private pool and landscaped lawn, creating a strong indoor-outdoor connection.",
        icon: "Diamond",
      },
      {
        label: "One-Acre Private Property",
        description:
          "Set on a one-acre plot with a built-up villa area of approximately 7,000 sq ft, offering complete privacy.",
        icon: "Diamond",
      },
      {
        label: "Private Pool with Lounge Setup",
        description:
          "Features a large private swimming pool with a dedicated bar and lounge setup, along with patio seating by the pool.",
        icon: "Diamond",
      },
      {
        label: "Flexible Multipurpose Hall",
        description:
          "Includes a multipurpose indoor hall that can be converted into a conference space for meetings or a dorm room for additional accommodation.",
        icon: "Diamond",
      },
      {
        label: "12-Seater Home Theatre",
        description:
          "A private home theatre designed for movie watching and indoor entertainment for up to 12 guests.",
        icon: "Diamond",
      },
      {
        label: "Expansive Landscaped Lawn",
        description:
          "A 25,000 sq ft landscaped lawn, suitable for private parties, corporate team outings, and wedding events ranging from 100 to 500 people.",
        icon: "Diamond",
      },
      {
        label: "Stay & Event Hosting Capacity",
        description:
          "Can host overnight stays for 25–30 guests and outdoor events for up to 500 people, depending on the setup.",
        icon: "Diamond",
      },
      {
        label: "Accessible Yet Secluded Location",
        description:
          "Located approximately 20 minutes from the Art of Living International Centre and opposite Pyramid Valley.",
        icon: "Diamond",
      },
      {
        label: "Customised Hosted Experiences",
        description:
          "Customisable experiences such as bonfire evenings, BBQs, curated dining, camping, and movie nights under the stars with a projector setup are available on prior request.",
        icon: "Diamond",
      },
      {
        label: "Indoor & Outdoor Games",
        description:
          "Guests can enjoy a variety of indoor and outdoor games, including Monopoly, UNO, Jenga, cricket, archery, frisbee, volleyball, and more.",
        icon: "Diamond",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 12 PAX",
            sublabel: "≈ ₹3,625 / head",
            price: "₹43,500 + taxes",
          },
          { label: "Additional Guests", price: "₹1,999 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 30 PAX",
            sublabel: "≈ ₹800/head",
            price: "₹43,500 + taxes",
          },
          { label: "Additional Guests", price: "₹1,999 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Magnolia, Harohalli, Kanakapura Road, Bangalore - 560082",
      distance: "Approximately 45 minutes from Bangalore City Center",
      nearby: [
        { label: "JW MARRIOT", distance: "1 km away" },
        { label: "AIRPORT", distance: "5 km away" },
        { label: "BUS STATION", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/assets/experience_wellness.png" },
      { title: "Weddings", image: "/assets/Wedding_for_Both.png" },
      { title: "Corporate Events", image: "/assets/Jade_735_for_Desktop.png" },
      { title: "Photo Shoots", image: "/assets/Bathing_Girls.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "What is the maximum guest capacity?",
        answer:
          "The venue can comfortably accommodate up to 700 guests for floating crowds, with seating capacity for 500-600 guests.",
      },
      {
        question: "Can we bring our own caterers?",
        answer:
          "Yes, you can bring your own caterers. We have a fully-equipped catering kitchen available for use.",
      },
      {
        question: "What about outdoor events during monsoon?",
        answer:
          "We have a semi-open party hall and covered gazebo area that can be used during rainy weather.",
      },
      {
        question: "Is there ample parking space?",
        answer:
          "Yes, we have designated parking for up to 50 cars within the property and additional valvlet services on request.",
      },
      {
        question: "Do you have power backup?",
        answer:
          "The villa is equipped with a 24/7 generator backup to ensure uninterrupted power supply during your event or stay.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Yes, we are a pet-friendly property. However, we request you to supervise your pets at all times.",
      },
      {
        question: "What are the check-in and check-out timings?",
        answer:
          "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.",
      },
    ],
  },
  {
    id: "tranquil-woods",
    name: "Tranquil Woods",
    type: "FARMHOUSE WITH EXPANSIVE LAWNS",
    location: "Kanakapura Road · Near Art of Living",
    stats: { stay: "20 Guests", events: "700 Guests", bhk: "2 BHK" },
    description:
      "A private glass villa set within lush green surroundings, featuring a 1.5 acre landscaped lawn and a pool. Surrounded by peaceful nature yet close to the city, this is ideal for those seeking privacy and exclusivity within the city limits.",
    perfectFor: ["Celebrations", "Weddings", "Weekends"],
    categories: ["Weddings", "Pet friendly"],
    image: "/assets/Wedding_for_Both.png",
    amenities: [
      { label: "Wifi", icon: "Wifi" },
      { label: "Parking", icon: "Car" },
      { label: "Pool", icon: "Waves" },
      { label: "Lawn", icon: "Trees" },
    ],
    // ADDED STRUCTURE
    spaces: [
      { name: "Lawn", image: "/assets/Wedding_for_Both.png" },
      { name: "Poolside", image: "/assets/Wedding_for_Both.png" },
      { name: "Living Area", image: "/assets/Wedding_for_Both.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "Modern 2-BHK Structure",
        description:
          "Cozy living spaces designed to overlook the private pool and expansive lawns.",
      },
      {
        title: "1.5 Acre Landscape",
        description:
          "Situated on a 1.5-acre plot with landscaped gardens perfect for outdoor gatherings.",
      },
      {
        title: "Private Pool",
        description:
          "Features a private swimming pool accessible directly from the villa.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 15 PAX",
            sublabel: "≈ ₹3,000 / head",
            price: "₹45,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,500 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 50 PAX",
            sublabel: "≈ ₹600/head",
            price: "₹30,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,200 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Tranquil Woods, Kanakapura Road, Bangalore",
      distance: "Approximately 45 minutes from Bangalore City Center",
      nearby: [
        { label: "JW MARRIOT", distance: "1 km away" },
        { label: "AIRPORT", distance: "5 km away" },
        { label: "BUS STATION", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/assets/experience_wellness.png" },
      { title: "Weddings", image: "/assets/Wedding_for_Both.png" },
      { title: "Corporate Events", image: "/assets/Jade_735_for_Desktop.png" },
      { title: "Photo Shoots", image: "/assets/Bathing_Girls.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "What is the maximum guest capacity?",
        answer:
          "The venue can comfortably accommodate up to 700 guests for floating crowds.",
      },
      {
        question: "Can we bring our own caterers?",
        answer:
          "Yes, you can bring your own caterers. We have a fully-equipped catering kitchen available for use.",
      },
      {
        question: "What about outdoor events during monsoon?",
        answer:
          "We have focused on outdoor landscaping; strictly indoor areas are limited.",
      },
    ],
  },
  {
    id: "royalty",
    name: "Royalty",
    type: "EQUESTRIAN HILL-VIEW LUXURY VILLA",
    location: "Chikkaballapur · Near Varlakonda Hill",
    stats: { stay: "15 Guests", events: "30 Guests", bhk: "5 BHK" },
    description:
      "A luxury villa set against the dramatic backdrop of Varlakonda Hill, it blends contemporary glass architecture with open green spaces and an immersive equestrian experience—ideal for intimate stays, curated gatherings, and nature-led celebrations.",
    perfectFor: ["Staycations", "Private Celebrations"],
    categories: ["Pre-wedding", "Pet friendly"],
    image: "/assets/casual_stays.png",
    amenities: [
      { label: "Wifi", icon: "Wifi" },
      { label: "Parking", icon: "Car" },
      { label: "Horses", icon: "Home" }, // Changed 'Horse' to 'Home' as fallback, user can specify correct icon later
      { label: "Hill View", icon: "Mountain" },
    ],
    spaces: [
      { name: "Hill View", image: "/assets/casual_stays.png" },
      { name: "Stables", image: "/assets/casual_stays.png" },
      { name: "Interior", image: "/assets/casual_stays.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "5-BHK Luxury Villa",
        description:
          "Spacious bedrooms with heavy glass utilization for panoramic hill views.",
      },
      {
        title: "Equestrian Center",
        description:
          "Unique feature of on-site stables allowing for an immersive equestrian experience.",
      },
      {
        title: "Hillside Location",
        description:
          "Set against Varlakonda Hill, offering dramatic natural scenery.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 10 PAX",
            sublabel: "≈ ₹4,000 / head",
            price: "₹40,000 + taxes",
          },
          { label: "Additional Guests", price: "₹2,000 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 20 PAX",
            sublabel: "≈ ₹1000/head",
            price: "₹20,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,500 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Royalty, Chikkaballapur, Near Varlakonda Hill",
      distance: "Approximately 60 minutes from Bangalore Airport",
      nearby: [
        { label: "NANDI HILLS", distance: "15 km away" },
        { label: "AIRPORT", distance: "20 km away" },
        { label: "HIGHWAY", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/assets/experience_wellness.png" },
      { title: "Weddings", image: "/assets/Wedding_for_Both.png" },
      { title: "Corporate Events", image: "/assets/Jade_735_for_Desktop.png" },
      { title: "Photo Shoots", image: "/assets/Bathing_Girls.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is horse riding included?",
        answer:
          "Interactions with horses are generally included, but riding sessions may be separately charged.",
      },
      {
        question: "Can we check in early?",
        answer:
          "Early check-in is subject to availability and prior confirmation.",
      },
      {
        question: "Is it suitable for pets?",
        answer: "Yes, the property is pet-friendly with ample outdoor space.",
      },
    ],
  },
  {
    id: "dome-villas",
    name: "Dome Villas",
    type: "HOBBIT THEMED FARMHOUSE",
    location: "Doddaballapur",
    stats: { stay: "3 Villas", events: "3 BHK Per Villa", bhk: "6 Guests" },
    description:
      "A one-of-a-kind private retreat featuring three dome shaped villas, designed to provide a tranquil escape, this villa with private pool & garden offers breathtaking hill views and a serene ambiance, making it the perfect for slow living and experience-led getaways close to nature.",
    perfectFor: ["Staycations", "Romantic Getaways"],
    categories: ["Pre-wedding"],
    image: "/assets/caravan_journey.png",
    amenities: [
      { label: "Private Pool", icon: "Waves" },
      { label: "Garden", icon: "Trees" }, // Changed 'Flower' to 'Trees' map as best fit
      { label: "Hill View", icon: "Mountain" },
    ],
    spaces: [
      { name: "Dome Exterior", image: "/assets/caravan_journey.png" },
      { name: "Pool Area", image: "/assets/caravan_journey.png" },
      { name: "Cozy Interior", image: "/assets/caravan_journey.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "Unique Dome Architecture",
        description:
          "Three separate dome-shaped villas offering a hobbit-themed experience.",
      },
      {
        title: "Private Pool per Villa",
        description:
          "Each unit has access to private pool areas ensuring seclusion.",
      },
      {
        title: "Hill Views",
        description:
          "Located in Doddaballapur with scenic views of the surrounding hills.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Per Villa (2 PAX)",
            sublabel: "≈ ₹7,500 / head",
            price: "₹15,000 + taxes",
          },
          { label: "Additional Bed", price: "₹2,000 + taxes" },
        ],
        features: [
          "Private pool access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Day Outing",
        subtitle: "8 hours (Selectable between 10 AM and 6 PM)",
        packages: [
          {
            label: "Couple Package",
            sublabel: "≈ ₹5,000/head",
            price: "₹10,000 + taxes",
          },
          { label: "Additional Guest", price: "₹2,500 + taxes" },
        ],
        features: ["Pool access", "Complimentary lunch"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Dome Villas, Doddaballapur, Bangalore",
      distance: "Approximately 60 minutes from Bangalore City Center",
      nearby: [
        { label: "NANDI HILLS", distance: "12 km away" },
        { label: "AIRPORT", distance: "25 km away" },
        { label: "VINEYARD", distance: "5 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/assets/experience_wellness.png" },
      { title: "Romantic Stays", image: "/assets/Wedding_for_Both.png" },
      { title: "Nature Walks", image: "/assets/Jade_735_for_Desktop.png" },
      { title: "Stargazing", image: "/assets/Bathing_Girls.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is the pool heated?",
        answer: "Pool heating is not currently available.",
      },
      {
        question: "Is food included?",
        answer:
          "Breakfast is complimentary. Other meals can be ordered from our menu or prepared by a private chef.",
      },
      {
        question: "Is it safe for solo travelers?",
        answer: "Yes, the property is fully secured and staffed 24/7.",
      },
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    type: "LARGE-SCALE EVENTS & WEDDING RETREAT",
    location: "Kanakapura Road · South Bengaluru",
    stats: { stay: "50 Guests", events: "1500 Guests", bhk: "9 BHK" },
    description:
      "A spacious three-acre private pool retreat surrounded by coconut groves, designed for large weddings, corporate gatherings, and high-energy social celebrations. Expansive lawns, staged event zones, and versatile indoor spaces allow seamless hosting at scale.",
    perfectFor: ["Weddings", "Corporate Retreats", "Large Events"],
    categories: ["Weddings", "Corporate Retreats"],
    image: "/assets/corporate_retreat.png",
    amenities: [
      { label: "Large Pool", icon: "Waves" },
      { label: "Coconut Grove", icon: "Trees" },
      { label: "Event Zones", icon: "PartyPopper" },
    ],
    spaces: [
      { name: "Grand Lawn", image: "/assets/corporate_retreat.png" },
      { name: "Banquet Hall", image: "/assets/corporate_retreat.png" },
      { name: "Pool Deck", image: "/assets/corporate_retreat.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A large catering team can be arranged for events.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Event Planning",
        description:
          "Dedicated event planner assistance for large scale setups.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "3-Acre Estate",
        description:
          "Expansive grounds capable of hosting up to 1500 guests comfortably.",
      },
      {
        title: "9-BHK Accommodation",
        description:
          "Large capacity for overnight stay, ideal for wedding parties.",
      },
      {
        title: "Versatile Event Zones",
        description:
          "Multiple distinct areas for different functions (Mehendi, Sangeet, Reception).",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 20 PAX",
            sublabel: "≈ ₹3,500 / head",
            price: "₹70,000 + taxes",
          },
          { label: "Additional Guests", price: "₹2,000 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "10 hours (Selectable timing)",
        packages: [
          {
            label: "Up to 500 PAX",
            sublabel: "≈ ₹300/head",
            price: "₹1,50,000 + taxes",
          },
          { label: "Additional Guests", price: "₹500 + taxes" },
        ],
        features: ["Venue access", "Basic lighting", "Security"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Diamond Retreat, Kanakapura Road, South Bengaluru",
      distance: "Approximately 50 minutes from Bangalore City Center",
      nearby: [
        { label: "METRO STATION", distance: "5 km away" },
        { label: "NICE ROAD", distance: "3 km away" },
        { label: "ART OF LIVING", distance: "4 km away" },
      ],
    },
    activities: [
      { title: "Grand Weddings", image: "/assets/Wedding_for_Both.png" },
      { title: "Concerts", image: "/assets/experience_wellness.png" },
      {
        title: "Corporate Offsites",
        image: "/assets/Jade_735_for_Desktop.png",
      },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is there ample parking?",
        answer:
          "Yes, we have designated parking space for up to 100 cars and valet services can be arranged.",
      },
      {
        question: "Are fireworks allowed?",
        answer:
          "Fireworks are permitted with prior approval and safety guidelines.",
      },
      {
        question: "Do you provide decor?",
        answer:
          "We have preferred decor partners but allow external vendors as well.",
      },
    ],
  },
  {
    id: "vanani",
    name: "Vanani",
    type: "PRIVATE FARMHOUSE WITH POOL & JACUZZI",
    location: "Mysore Road, · Near Wonderla",
    stats: { stay: "20 Guests", events: "80 Guests", bhk: "6+1 BHK + Cottage" },
    description:
      "Vanani is a secluded, nature-rich private villa retreat made up of distinct stay units - a rustic stone villa, cozy cottage, and a standalone tiny home. Set amid lush lawns and fruit trees, it blends earthy architecture with modern comforts, including pool with a cascading waterfall and jacuzzi.",
    perfectFor: ["Staycations", "Family Getaways"],
    categories: ["Pet friendly", "Corporate Retreats"],
    image: "/assets/wellness_retreat.png",
    amenities: [
      { label: "Waterfall Pool", icon: "Waves" },
      { label: "Jacuzzi", icon: "Bath" },
      { label: "Tiny Home", icon: "Home" },
    ],
    spaces: [
      { name: "Main Villa", image: "/assets/wellness_retreat.png" },
      { name: "Cottage", image: "/assets/wellness_retreat.png" },
      { name: "Tiny Home", image: "/assets/wellness_retreat.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "Eclectic Mix of Units",
        description:
          "Comprises a stone villa, a cottage, and a tiny home for diverse stay experiences.",
      },
      {
        title: "Nature-Rich Location",
        description:
          "Set amidst fruit orchards and lush greenery near Wonderla.",
      },
      {
        title: "Waterfall Pool & Jacuzzi",
        description:
          "Features a unique pool with waterfall feature and a relaxing jacuzzi.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 12 PAX",
            sublabel: "≈ ₹3,000 / head",
            price: "₹36,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,800 + taxes" },
        ],
        features: [
          "Venue access",
          "access to all units",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 50 PAX",
            sublabel: "≈ ₹700/head",
            price: "₹35,000 + taxes",
          },
          { label: "Additional Guests", price: "₹900 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Vanani, Mysore Road, Near Wonderla, Bangalore",
      distance: "Approximately 50 minutes from Bangalore City Center",
      nearby: [
        { label: "WONDERLA", distance: "2 km away" },
        { label: "MYSORE RD", distance: "1 km away" },
        { label: "KENGERI", distance: "10 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/assets/experience_wellness.png" },
      { title: "Family Reunions", image: "/assets/Wedding_for_Both.png" },
      { title: "Nature Retreats", image: "/assets/Jade_735_for_Desktop.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is the jacuzzi heated?",
        answer: "Yes, the jacuzzi has temperature control functionality.",
      },
      {
        question: "Is the property wheelchair accessible?",
        answer:
          "Parts of the main villa are accessible, but the tiny home may not be.",
      },
      {
        question: "Can we pick fruit?",
        answer: "Fruit picking is allowed subject to season and availability.",
      },
    ],
  },
  {
    id: "the-haven",
    name: "The Haven",
    type: "PRIVATE FARMHOUSE WITH POOL",
    location: "Hennur-Bagalur Road · North Bengaluru",
    stats: { stay: "12 Guests", events: "80 Guests", bhk: "5 BHK" },
    description:
      "A private farmhouse villa set amidst greenery, designed for relaxed stays and intimate celebrations. Featuring a landscaped lawn, private pool and a glass-roof jacuzzi suite, it offers a calm, nature-led setting for small weddings, family gatherings, and meaningful get-togethers.",
    perfectFor: ["Staycations", "Private Celebrations"],
    categories: ["Pet friendly", "Pre-wedding"],
    image: "/assets/Bathing_Girls.png",
    amenities: [
      { label: "Private Pool", icon: "Waves" },
      { label: "Jacuzzi Suite", icon: "Bath" },
      { label: "Lawn", icon: "Trees" },
    ],
    spaces: [
      { name: "Poolside", image: "/assets/Bathing_Girls.png" },
      { name: "Jacuzzi Suite", image: "/assets/Bathing_Girls.png" },
      { name: "Lawn Area", image: "/assets/Bathing_Girls.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "Glass-Roof Jacuzzi Suite",
        description:
          "A signature suite featuring a glass roof for stargazing from the jacuzzi.",
      },
      {
        title: "Private Farmhouse Setting",
        description:
          "Surrounded by greenery in North Bengaluru, offering peace and quiet.",
      },
      {
        title: "Intimate Event Space",
        description: "Perfect for small gatherings and private celebrations.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 10 PAX",
            sublabel: "≈ ₹3,200 / head",
            price: "₹32,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,800 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 40 PAX",
            sublabel: "≈ ₹700/head",
            price: "₹28,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,000 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "The Haven, Hennur-Bagalur Road, North Bengaluru",
      distance: "Approximately 40 minutes from Hebbal",
      nearby: [
        { label: "AIRPORT", distance: "20 km away" },
        { label: "BHARTIYA CITY", distance: "5 km away" },
        { label: "YELAHANKA", distance: "10 km away" },
      ],
    },
    activities: [
      { title: "Wellness Retreats", image: "/assets/experience_wellness.png" },
      { title: "Intimate Weddings", image: "/assets/Wedding_for_Both.png" },
      { title: "Couple Shoots", image: "/assets/Jade_735_for_Desktop.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is alcohol permitted?",
        answer:
          "Yes, guests can bring their own alcohol. Corkage charges may apply for events.",
      },
      {
        question: "Is there power backup?",
        answer: "Yes, the property has full generator backup.",
      },
    ],
  },
  {
    id: "retreat-on-the-ridge",
    name: "Retreat on the Ridge",
    type: "HILL-VIEW FARMHOUSE",
    location: "Ramanagara · South-West of Bengaluru",
    stats: { stay: "20 Guests", events: "80 Guests", bhk: "4 BHK" },
    description:
      "A contemporary private pool villa set against the scenic Varalakonda hill range, offering panoramic views, a waterfall pool, and open outdoor spaces. Designed for peaceful stays, intimate celebrations, and nature-led getaways away from the city.",
    perfectFor: ["Staycations", "Small Events", "Family Gatherings"],
    categories: ["Pet friendly", "Weddings"],
    image: "/assets/Jade_735_for_Desktop.png",
    amenities: [
      { label: "Infinity Pool", icon: "Waves" },
      { label: "Hill View", icon: "Mountain" },
      { label: "Outdoor Space", icon: "Sun" },
    ],
    spaces: [
      { name: "Infinity Pool", image: "/assets/Jade_735_for_Desktop.png" },
      { name: "Deck Area", image: "/assets/Jade_735_for_Desktop.png" },
      { name: "Living Room", image: "/assets/Jade_735_for_Desktop.png" },
    ],
    services: [
      {
        title: "Chef on Call",
        description: "A private chef can be arranged for curated meals.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "On-site service support can be arranged for events or hosted stays.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Housekeeping services are available during the stay to maintain rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, experiences, or logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        title: "Infinity Pool",
        description: "Stunning infinity pool overlooking the hills.",
      },
      {
        title: "Hill-View Bedrooms",
        description:
          "Rooms designed to maximize the scenic views of Ramanagara.",
      },
      {
        title: "Outdoor Deck",
        description:
          "Large deck area perfect for sunrise yoga or evening stargazing.",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 12 PAX",
            sublabel: "≈ ₹3,500 / head",
            price: "₹42,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,800 + taxes" },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Event Experience",
        subtitle: "8 hours (Selectable between 2 PM and 12 AM)",
        packages: [
          {
            label: "Up to 30 PAX",
            sublabel: "≈ ₹800/head",
            price: "₹24,000 + taxes",
          },
          { label: "Additional Guests", price: "₹1,200 + taxes" },
        ],
        features: ["Private venue access", "Complimentary high tea"],
      },
    },
    locationDetails: {
      mapImage: "/assets/map_placeholder.png",
      address: "Retreat on the Ridge, Ramanagara, Bengaluru",
      distance: "Approximately 90 minutes from Bangalore City Center",
      nearby: [
        { label: "SHOLAY HILLS", distance: "5 km away" },
        { label: "WONDERLA", distance: "20 km away" },
        { label: "BIG BANYAN", distance: "15 km away" },
      ],
    },
    activities: [
      { title: "Trekking", image: "/assets/experience_wellness.png" },
      { title: "Cycling", image: "/assets/Wedding_for_Both.png" },
      { title: "Bird Watching", image: "/assets/Jade_735_for_Desktop.png" },
    ],
    video: "/assets/video_placeholder.png",
    faq: [
      {
        question: "Is the road accessible for large vehicles?",
        answer: "Yes, the approach road is well-paved.",
      },
      {
        question: "Is there mobile network coverage?",
        answer:
          "Network coverage is generally good, but WiFi is also provided.",
      },
    ],
  },
];

export const CATEGORIES = [
  "All",
  "Pet friendly",
  "Corporate Retreats",
  "Weddings",
  "Pre-wedding",
];
