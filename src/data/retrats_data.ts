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
      { name: "Lawn", image: "/X/Magnolia/12.webp" },
      { name: "Poolside", image: "/X/Magnolia/VILLA.webp" },
      { name: "Living Area", image: "/X/Magnolia/LIVING ROOM.webp" },
    ],
    categories: ["Weddings", "Corporate Retreats", "Pre-wedding"],
    image: "/X/Magnolia/VILLA2.webp",
    images: [
      "/X/Magnolia/12.webp",
      "/X/Magnolia/13.webp",
      "/X/Magnolia/14.webp",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "/X/Magnolia/16.webp",
      "/X/Magnolia/17.webp",
      "/X/Magnolia/18.webp",
      "/X/Magnolia/19.webp",
      "/X/Magnolia/22.webp",
      "/X/Magnolia/VILLA.webp",
      "/X/Magnolia/LIVING ROOM.webp",
      "/X/Magnolia/BEDROOM1.webp",
      "/X/Magnolia/FAMILY ROOM.webp",
      "/X/Magnolia/VILLA2.webp",
    ],
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Magnolia, Harohalli, Kanakapura Road, Bangalore - 560082",
      distance: "Approximately 45 minutes from Bangalore City Center",
      nearby: [
        { label: "JW MARRIOT", distance: "1 km away" },
        { label: "AIRPORT", distance: "5 km away" },
        { label: "BUS STATION", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/X/Tranquil Woods/10.webp" },
      { title: "Weddings", image: "/X/Magnolia/9.webp" },
      { title: "Corporate Events", image: "/X/ROR/14.webp" },
      {
        title: "Photo Shoots",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
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
    image: "/X/Tranquil Woods/1.webp",
    images: [
      "/X/Tranquil Woods/1.webp",
      "/X/Tranquil Woods/2.webp",
      "/X/Tranquil Woods/3.webp",
      "/X/Tranquil Woods/4.webp",
      "/X/Tranquil Woods/7.webp",
      "/X/Tranquil Woods/8.webp",
      "/X/Tranquil Woods/9.webp",
      "/X/Tranquil Woods/10.webp",
      "/X/Tranquil Woods/11.webp",
      "/X/Tranquil Woods/12.webp",
      "/X/Tranquil Woods/13.webp",
      "/X/Tranquil Woods/14.webp",
      "https://images.unsplash.com/photo-1613490908688-66236b22eb5c?auto=format&fit=crop&w=1600&q=80",
      "/X/Tranquil Woods/16.webp",
      "/X/Tranquil Woods/17.webp",
      "/X/Tranquil Woods/18.webp",
      "/X/Tranquil Woods/20.webp",
      "/X/Tranquil Woods/24.webp",
    ],
    amenities: [
      { label: "Wifi", icon: "Wifi" },
      { label: "Parking", icon: "Car" },
      { label: "Pool", icon: "Waves" },
      { label: "Lawn", icon: "Trees" },
    ],
    // ADDED STRUCTURE
    spaces: [
      { name: "Lawn", image: "/X/Tranquil Woods/2.webp" },
      { name: "Poolside", image: "/X/Tranquil Woods/3.webp" },
      { name: "Living Area", image: "/X/Tranquil Woods/12.webp" },
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Tranquil Woods, Kanakapura Road, Bangalore",
      distance: "Approximately 45 minutes from Bangalore City Center",
      nearby: [
        { label: "JW MARRIOT", distance: "1 km away" },
        { label: "AIRPORT", distance: "5 km away" },
        { label: "BUS STATION", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/X/Tranquil Woods/10.webp" },
      { title: "Weddings", image: "/X/Magnolia/9.webp" },
      { title: "Corporate Events", image: "/X/ROR/14.webp" },
      {
        title: "Photo Shoots",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
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
    image: "/X/Magnolia/10.webp",
    images: [
      "/X/Magnolia/17.webp",
      "/X/Magnolia/18.webp",
      "/X/Magnolia/19.webp",
      "/X/Magnolia/22.webp",
      "/X/Magnolia/VILLA.webp",
      "/X/Magnolia/LIVING ROOM.webp",
      "/X/Magnolia/BEDROOM1.webp",
    ],
    amenities: [
      { label: "Wifi", icon: "Wifi" },
      { label: "Parking", icon: "Car" },
      { label: "Horses", icon: "Home" }, // Changed 'Horse' to 'Home' as fallback, user can specify correct icon later
      { label: "Hill View", icon: "Mountain" },
    ],
    spaces: [
      { name: "Hill View", image: "/X/Magnolia/11.webp" },
      { name: "Stables", image: "/X/Magnolia/12.webp" },
      { name: "Interior", image: "/X/Magnolia/13.webp" },
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Royalty, Chikkaballapur, Near Varlakonda Hill",
      distance: "Approximately 60 minutes from Bangalore Airport",
      nearby: [
        { label: "NANDI HILLS", distance: "15 km away" },
        { label: "AIRPORT", distance: "20 km away" },
        { label: "HIGHWAY", distance: "2 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/X/Tranquil Woods/10.webp" },
      { title: "Weddings", image: "/X/Magnolia/9.webp" },
      { title: "Corporate Events", image: "/X/ROR/14.webp" },
      {
        title: "Photo Shoots",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
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
    type: "HOBBIT THEMED VILLA RETREAT",
    location: "Doddaballapur · North Bengaluru",
    stats: {
      stay: "3 Villas",
      events: "3 BHK Per Villa",
      bhk: "6 Guests",
      lawn: "2,000 sqft",
      villaArea: "1,200 sqft",
    },
    description:
      "A one-of-a-kind private retreat featuring three dome-shaped villas inspired by hobbit architecture, each with its own private pool and garden. Set amidst scenic hills in Doddaballapur, Dome Villas offers breathtaking views, a serene ambiance, and a curated slow-living experience — perfect for romantic getaways, intimate celebrations, and nature-led escapes close to Bangalore.",
    perfectFor: [
      "Staycations",
      "Romantic Getaways",
      "Celebrations",
      "Pre-wedding",
    ],
    categories: ["Pre-wedding", "Pet friendly", "Corporate Retreats"],
    image:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_01_Image_0001.webp",
    images: [
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_01_Image_0001.webp",
      "/X/Dome Villas/Red Dome/1.webp",
      "/X/Dome Villas/Yellow Dome/DSC00323.webp",
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_05_Image_0002.webp",
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
    ],
    amenities: [
      {
        label: "Private Pool",
        icon: "Waves",
        description:
          "Each dome villa has access to a private pool area, ensuring complete seclusion and a tranquil swim experience surrounded by nature.",
      },
      {
        label: "Garden",
        icon: "Trees",
        description:
          "Lush private gardens surround each villa, creating a natural buffer and a serene outdoor space for relaxation.",
      },
      {
        label: "Hill View",
        icon: "Mountain",
        description:
          "Located in the scenic hills of Doddaballapur, each villa offers panoramic views of the surrounding landscape.",
      },
      {
        label: "Outdoor Dining",
        icon: "Sun",
        description:
          "Dedicated outdoor dining deck for alfresco meals amidst nature — perfect for candlelight dinners and brunches.",
      },
      {
        label: "Wifi",
        icon: "Wifi",
        description:
          "High-speed wireless internet available across all three villas and common areas.",
      },
      {
        label: "Parking",
        icon: "Car",
        description:
          "Secure on-site parking available for all guests with easy access to villa entrances.",
      },
      {
        label: "Air-conditioned Interiors",
        icon: "Wind",
        description:
          "All dome interiors are fully air-conditioned for comfort throughout the stay, regardless of weather.",
      },
      {
        label: "Nature Trails",
        icon: "Leaf",
        description:
          "Direct access to scenic nature trails and walking paths through the surrounding hills and greenery.",
      },
    ],
    spaces: [
      { name: "Dome Exterior", image: "/X/Dome Villas/Red Dome/1.webp" },
      {
        name: "Pool Area",
        image: "/X/Dome Villas/Yellow Dome/DSC00323.webp",
      },
      {
        name: "Cozy Interior",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_05_Image_0002.webp",
      },
      {
        name: "Outdoor Deck",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    services: [
      {
        title: "Chef on Call",
        description:
          "A private chef can be arranged for curated meals — from candlelight dinners to full-day brunch experiences.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "Dedicated on-site service support for hosted stays, ensuring seamless hospitality and personalised attention.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Daily housekeeping services during your stay to maintain villa interiors and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, nature excursions, experience bookings, and logistics around the stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        label: "Unique Dome Architecture",
        description:
          "Three separate dome-shaped villas offering a hobbit-inspired living experience — each architecturally distinct with curved walls, skylights, and organic design elements.",
        icon: "Diamond",
      },
      {
        label: "Private Pool per Villa",
        description:
          "Each dome villa has access to its own private pool area, ensuring complete seclusion and privacy for guests.",
        icon: "Diamond",
      },
      {
        label: "Scenic Hill Location",
        description:
          "Nestled in the hills of Doddaballapur, the property offers panoramic views of the surrounding landscape with a sense of total escapism.",
        icon: "Diamond",
      },
      {
        label: "Outdoor Dining Deck",
        description:
          "A dedicated outdoor dining setup surrounded by nature — ideal for romantic candlelight dinners and curated culinary experiences.",
        icon: "Diamond",
      },
      {
        label: "Tree House Experience",
        description:
          "Elevated tree house-style structures offering a unique stay experience with aerial views of the garden and surrounding greenery.",
        icon: "Diamond",
      },
      {
        label: "Nature Immersion",
        description:
          "Direct access to nature trails, walking paths, and scenic viewpoints — designed for slow living and mindful escapes.",
        icon: "Diamond",
      },
      {
        label: "3 BHK per Villa",
        description:
          "Each dome villa features three bedrooms, making it suitable for small groups, families, or couples seeking privacy.",
        icon: "Diamond",
      },
      {
        label: "Pet-friendly Property",
        description:
          "The property welcomes pets with ample outdoor space for them to explore safely under supervision.",
        icon: "Diamond",
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Dome Villas, Doddaballapur, North Bengaluru",
      distance: "Approximately 60 minutes from Bangalore City Center",
      nearby: [
        { label: "NANDI HILLS", distance: "12 km away" },
        { label: "AIRPORT", distance: "25 km away" },
        { label: "VINEYARD", distance: "5 km away" },
        { label: "HIGHWAY", distance: "3 km away" },
      ],
    },
    activities: [
      { title: "Romantic Stays", image: "/X/Magnolia/9.webp" },
      { title: "Weekend Getaways", image: "/X/Tranquil Woods/10.webp" },
      { title: "Nature Walks", image: "/X/ROR/14.webp" },
      {
        title: "Pre-wedding Shoots",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
    faq: [
      {
        question: "How many guests can each dome villa accommodate?",
        answer:
          "Each dome villa can accommodate up to 6 guests across 3 bedrooms. Additional rollaway beds are available on request.",
      },
      {
        question: "Is the pool heated?",
        answer:
          "Pool heating is not currently available. The pools are best enjoyed during the warmer months.",
      },
      {
        question: "Is food included?",
        answer:
          "Complimentary breakfast is included with every stay. Other meals can be ordered from our in-house menu or prepared by a private chef on request.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Yes, Dome Villas is a pet-friendly property with ample outdoor space. We request that pets are supervised at all times.",
      },
      {
        question: "Is it safe for solo travelers?",
        answer:
          "Yes, the property is fully secured with 24/7 staffing. Solo travelers and couples frequently visit for the tranquil experience.",
      },
      {
        question: "Can we book all three villas together?",
        answer:
          "Yes, all three dome villas can be booked together for group stays, small celebrations, or team retreats.",
      },
      {
        question: "What are the check-in and check-out timings?",
        answer:
          "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.",
      },
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    type: "LARGE FORMAT EVENT SPACE · WEDDING VENUE",
    location: "Kanakapura Road · South Bengaluru",
    stats: {
      stay: "50 Guests",
      events: "1500 Guests",
      bhk: "9 BHK",
      lawn: "50,000 sqft",
      villaArea: "5,000 sqft",
    },
    description:
      "A sprawling three-acre private estate surrounded by coconut groves, Diamond is purpose-built for large-format weddings, corporate gatherings, and high-energy social celebrations. With a 50,000 sq ft grand lawn, staged event zones, versatile indoor banquet spaces, and a private pool deck, it offers seamless hosting at scale — from intimate rehearsals to 1500-guest receptions.",
    perfectFor: [
      "Weddings",
      "Corporate Retreats",
      "Large Events",
      "Celebrations",
      "Pre-wedding",
    ],
    categories: ["Weddings", "Corporate Retreats", "Pre-wedding"],
    image: "/X/ROR/5.webp",
    images: [
      "/X/ROR/3.webp",
      "/X/ROR/4.webp",
      "/X/ROR/5.webp",
      "/X/ROR/6.webp",
      "/X/ROR/7.webp",
      "/X/ROR/8.webp",
      "/X/ROR/9.webp",
      "/X/ROR/10.webp",
    ],
    amenities: [
      {
        label: "Private Pool",
        icon: "Waves",
        description:
          "A large private swimming pool with poolside deck, perfect for pre-event cocktails and leisure during overnight stays.",
      },
      {
        label: "Air-conditioned Interiors",
        icon: "Wind",
        description:
          "All bedrooms and indoor banquet areas are fully air-conditioned for year-round comfort.",
      },
      {
        label: "Coconut Grove",
        icon: "Trees",
        description:
          "The estate is surrounded by mature coconut groves, creating a natural canopy and tropical ambiance for outdoor celebrations.",
      },
      {
        label: "Event Zones",
        icon: "PartyPopper",
        description:
          "Multiple staged event zones across the property — separate areas for Mehendi, Sangeet, Reception, and cocktail setups.",
      },
      {
        label: "Parking",
        icon: "Car",
        description:
          "Dedicated parking for up to 100 vehicles with valet services available on request for large events.",
      },
      {
        label: "Wifi",
        icon: "Wifi",
        description:
          "High-speed wireless internet available across the property, including outdoor event zones.",
      },
      {
        label: "Banquet Hall",
        icon: "Presentation",
        description:
          "An indoor banquet hall suitable for seated dinners, conferences, and indoor reception setups for up to 300 guests.",
      },
      {
        label: "Outdoor Seating",
        icon: "Sun",
        description:
          "Multiple outdoor lounge and seating arrangements across the lawn and poolside for relaxation between events.",
      },
    ],
    spaces: [
      { name: "Grand Lawn", image: "/X/ROR/6.webp" },
      { name: "Banquet Hall", image: "/X/ROR/7.webp" },
      { name: "Pool Deck", image: "/X/ROR/8.webp" },
      { name: "Coconut Grove", image: "/X/ROR/9.webp" },
    ],
    services: [
      {
        title: "Chef on Call",
        description:
          "Professional catering teams can be arranged for events of any scale — from intimate dinners to 1500-guest wedding feasts.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "Dedicated on-site service staff for events and hosted stays, ensuring seamless hospitality throughout.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Full housekeeping services during multi-day events and overnight stays to maintain all rooms and common areas.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Event Planning",
        description:
          "Dedicated event planner assistance for large-scale setups — from stage design and lighting to vendor coordination and day-of management.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        label: "3-Acre Private Estate",
        description:
          "An expansive three-acre property featuring a 50,000 sq ft grand lawn, coconut groves, and multiple event zones — capable of hosting up to 1500 guests comfortably.",
        icon: "Diamond",
      },
      {
        label: "9-BHK Accommodation",
        description:
          "Nine fully-furnished bedrooms across the estate, providing overnight capacity for up to 50 guests — ideal for multi-day wedding celebrations.",
        icon: "Diamond",
      },
      {
        label: "Versatile Event Zones",
        description:
          "Multiple distinct areas designed for different functions — separate zones for Mehendi, Sangeet, Reception, and cocktail setups with independent décor access.",
        icon: "Diamond",
      },
      {
        label: "Private Pool with Deck",
        description:
          "A large pool with surrounding deck area, suitable for pool parties, pre-event gatherings, and leisure during overnight stays.",
        icon: "Diamond",
      },
      {
        label: "Indoor Banquet Hall",
        description:
          "A climate-controlled indoor banquet space for seated dinners, corporate conferences, and indoor reception setups accommodating up to 300 guests.",
        icon: "Diamond",
      },
      {
        label: "50,000 sqft Grand Lawn",
        description:
          "An expansive manicured lawn suitable for large-scale outdoor ceremonies, stage setups, and open-air dining for 500 to 1500 guests.",
        icon: "Diamond",
      },
      {
        label: "Staging & Lighting Infrastructure",
        description:
          "Pre-wired electrical and staging infrastructure across event zones for professional lighting, sound, and AV setups without additional installation.",
        icon: "Diamond",
      },
      {
        label: "Accessible Yet Secluded Location",
        description:
          "Located on Kanakapura Road in South Bengaluru, approximately 50 minutes from the city center — easily accessible via NICE Road while offering complete privacy.",
        icon: "Diamond",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Up to 20 PAX",
            sublabel: "≈ ₹3,250 / head",
            price: "₹65,000 + taxes",
          },
          { label: "Additional Guests", price: "₹2,000 + taxes" },
        ],
        features: [
          "Full venue access",
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
        features: [
          "Full venue access",
          "Basic lighting & staging",
          "Security & parking",
        ],
      },
    },
    locationDetails: {
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Diamond Retreat, Kanakapura Road, South Bengaluru — 560082",
      distance: "Approximately 50 minutes from Bangalore City Center",
      nearby: [
        { label: "NICE ROAD", distance: "3 km away" },
        { label: "METRO STATION", distance: "5 km away" },
        { label: "ART OF LIVING", distance: "4 km away" },
        { label: "AIRPORT", distance: "45 km away" },
      ],
    },
    activities: [
      { title: "Grand Weddings", image: "/X/Magnolia/9.webp" },
      { title: "Corporate Offsites", image: "/X/ROR/14.webp" },
      { title: "Concerts & Celebrations", image: "/X/Tranquil Woods/10.webp" },
      {
        title: "Pre-wedding Shoots",
        image:
          "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
    faq: [
      {
        question: "What is the maximum guest capacity?",
        answer:
          "Diamond can host up to 1500 guests for floating events and seated dinners for up to 800 guests across the grand lawn and banquet hall.",
      },
      {
        question: "Is there ample parking?",
        answer:
          "Yes, designated parking for up to 100 cars with professional valet services available on request for large events.",
      },
      {
        question: "Can we bring our own caterers and vendors?",
        answer:
          "Yes, external caterers, decorators, photographers, and planners are welcome. We also have a network of preferred partners if needed.",
      },
      {
        question: "Are fireworks allowed?",
        answer:
          "Fireworks and pyrotechnics are permitted with prior approval and adherence to safety guidelines.",
      },
      {
        question: "Is the venue suitable for multi-day events?",
        answer:
          "Absolutely. The 9-BHK accommodation supports multi-day celebrations with separate zones for each event function.",
      },
      {
        question: "Do you provide décor and staging?",
        answer:
          "We have preferred décor partners and pre-wired staging infrastructure. External vendors are also welcome with prior coordination.",
      },
      {
        question: "What are the check-in and check-out timings?",
        answer:
          "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.",
      },
    ],
  },
  {
    id: "vannani",
    name: "Vannani - Retreat by Nature",
    type: "NATURE RETREAT FOR INTIMATE CELEBRATIONS",
    location: "Bangalore",
    stats: { stay: "20 Guests", events: "25 Guests", bhk: "2" },
    description:
      "A villa retreat set amidst lush orchards, featuring two separate units. With a lap pool, outdoor spaces & nature experiences, Vannani is ideal for brunch & relaxed group getaways.",
    perfectFor: ["Staycations", "Family Getaways", "Celebrations"],
    categories: ["Pet friendly", "Corporate Retreats"],
    image: "/X/Magnolia/17.webp",
    images: [
      "/X/Magnolia/12.webp",
      "/X/Magnolia/13.webp",
      "/X/Magnolia/14.webp",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "/X/Magnolia/16.webp",
      "/X/Magnolia/17.webp",
      "/X/Magnolia/18.webp",
      "/X/Magnolia/19.webp",
    ],
    amenities: [
      { label: "Waterfall Pool", icon: "Waves" },
      { label: "Jacuzzi", icon: "Bath" },
      { label: "Tiny Home", icon: "Home" },
    ],
    spaces: [
      { name: "Main Villa", image: "/X/Magnolia/18.webp" },
      { name: "Cottage", image: "/X/Magnolia/19.webp" },
      { name: "Tiny Home", image: "/X/Magnolia/22.webp" },
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Vanani, Mysore Road, Near Wonderla, Bangalore",
      distance: "Approximately 50 minutes from Bangalore City Center",
      nearby: [
        { label: "WONDERLA", distance: "2 km away" },
        { label: "MYSORE RD", distance: "1 km away" },
        { label: "KENGERI", distance: "10 km away" },
      ],
    },
    activities: [
      { title: "Weekend Getaways", image: "/X/Tranquil Woods/10.webp" },
      { title: "Family Reunions", image: "/X/Magnolia/9.webp" },
      { title: "Nature Retreats", image: "/X/ROR/14.webp" },
    ],
    video: "/X/Magnolia/9.webp",
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
    type: "PRIVATE LUXURY VILLA RETREAT",
    location: "Hennur-Bagalur Road · North Bengaluru",
    stats: {
      stay: "20 Guests",
      events: "100 Guests",
      bhk: "4 BHK",
      lawn: "5,000 sqft",
      villaArea: "3,500 sqft",
    },
    description:
      "A private farmhouse villa set amidst greenery, designed for relaxed stays and intimate celebrations. Featuring a landscaped lawn, private pool with deck, a glass-roof jacuzzi suite, and contemporary interiors, it offers a calm, nature-led setting for small weddings, family gatherings, and meaningful get-togethers. Located on the Hennur-Bagalur Road in North Bengaluru, Haven blends accessibility with complete seclusion.",
    perfectFor: [
      "Staycations",
      "Private Celebrations",
      "Pre-wedding",
      "Corporate Retreats",
    ],
    categories: [
      "Pet friendly",
      "Pre-wedding",
      "Weddings",
      "Corporate Retreats",
    ],
    image: "/X/HAVEN/1.webp",
    images: [
      "/X/HAVEN/1.webp",
      "/X/HAVEN/2.webp",
      "/X/HAVEN/3.webp",
      "/X/HAVEN/4.webp",
      "/X/HAVEN/BEDROOM1.webp",
      "/X/HAVEN/BEDROOM2.webp",
      "/X/HAVEN/BEDROOM3.webp",
      "/X/HAVEN/BONFIRE.webp",
      "/X/HAVEN/DRONE LAWN NIGHT.webp",
      "/X/HAVEN/DSC00104.webp",
      "/X/HAVEN/HAVEN LIVING ROOM 4.webp",
      "/X/HAVEN/POOL TABLE1.webp",
      "/X/HAVEN/dining 1.webp",
      "/X/HAVEN/lawn drone.webp",
      "/X/HAVEN/pool new.webp",
    ],
    amenities: [
      {
        label: "Private Pool with Deck",
        icon: "Waves",
        description:
          "A private swimming pool with a spacious wooden deck — perfect for poolside lounging, morning dips, and evening cocktails.",
      },
      {
        label: "Glass-Roof Jacuzzi Suite",
        icon: "Bath",
        description:
          "A signature suite featuring a glass roof for stargazing from the jacuzzi — the most romantic room at Haven.",
      },
      {
        label: "Landscaped Lawn",
        icon: "Trees",
        description:
          "A 5,000 sqft landscaped lawn ideal for intimate weddings, outdoor dinners, and private celebrations under the stars.",
      },
      {
        label: "Contemporary Interiors",
        icon: "LayoutGrid",
        description:
          "Thoughtfully designed contemporary interiors with premium furnishings across all living spaces and bedrooms.",
      },
      {
        label: "Bonfire Pit",
        icon: "Flame",
        description:
          "A dedicated bonfire area for cosy evenings, storytelling sessions, and late-night gatherings.",
      },
      {
        label: "Pool Table",
        icon: "Circle",
        description:
          "A professional pool table in the recreation zone for indoor entertainment.",
      },
      {
        label: "Wifi",
        icon: "Wifi",
        description:
          "High-speed wireless internet throughout the villa and outdoor areas.",
      },
      {
        label: "Parking",
        icon: "Car",
        description:
          "Secure on-site parking accommodating multiple vehicles with direct villa access.",
      },
    ],
    spaces: [
      { name: "Poolside", image: "/X/HAVEN/pool new.webp" },
      { name: "Jacuzzi Suite", image: "/X/HAVEN/BEDROOM3.webp" },
      { name: "Lawn Area", image: "/X/HAVEN/lawn drone.webp" },
      { name: "Living Room", image: "/X/HAVEN/HAVEN LIVING ROOM 4.webp" },
    ],
    services: [
      {
        title: "Chef on Call",
        description:
          "A private chef can be arranged for curated meals — from farm-to-table brunches to multi-course candlelight dinners and BBQ nights.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "Dedicated on-site service support to manage hosted events, private celebrations, and ensure seamless hospitality throughout.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Daily housekeeping services during your stay to maintain bedrooms, pool area, lawn, and all common spaces.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, nearby excursions, transportation, décor, and logistics around your stay or event.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        label: "Glass-Roof Jacuzzi Suite",
        description:
          "A signature suite featuring a glass roof for stargazing from the jacuzzi — the most romantic and unique feature of Haven.",
        icon: "Diamond",
      },
      {
        label: "Private Pool with Deck",
        description:
          "A spacious pool with a wooden deck, designed for poolside relaxation, morning laps, and sunset cocktail sessions.",
        icon: "Diamond",
      },
      {
        label: "Private Farmhouse Setting",
        description:
          "Surrounded by greenery on the Hennur-Bagalur Road in North Bengaluru, offering peace, privacy, and complete seclusion.",
        icon: "Diamond",
      },
      {
        label: "Contemporary Design",
        description:
          "Modern, thoughtfully designed interiors with premium furnishings that balance luxury with comfort across all living spaces.",
        icon: "Diamond",
      },
      {
        label: "Landscaped Lawn & Garden",
        description:
          "A 5,000 sqft landscaped lawn with garden seating, ideal for intimate weddings, outdoor dinners, and private gatherings.",
        icon: "Diamond",
      },
      {
        label: "Bonfire & Outdoor Spaces",
        description:
          "Dedicated bonfire pit and outdoor seating areas for late-night get-togethers and al fresco dining under the stars.",
        icon: "Diamond",
      },
      {
        label: "4 BHK Accommodation",
        description:
          "Four spacious bedrooms with premium furnishings and air-conditioning, accommodating up to 20 guests for overnight stays.",
        icon: "Diamond",
      },
      {
        label: "Pet-friendly Property",
        description:
          "Haven welcomes pets with ample garden and lawn space. We request that pets are supervised at all times.",
        icon: "Diamond",
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "The Haven, Hennur-Bagalur Road, North Bengaluru",
      distance: "Approximately 40 minutes from Hebbal",
      nearby: [
        { label: "AIRPORT", distance: "20 km away" },
        { label: "BHARTIYA CITY", distance: "5 km away" },
        { label: "YELAHANKA", distance: "10 km away" },
        { label: "HIGHWAY", distance: "5 km away" },
      ],
    },
    activities: [
      { title: "Wellness Retreats", image: "/X/Tranquil Woods/10.webp" },
      { title: "Intimate Weddings", image: "/X/Magnolia/9.webp" },
      { title: "Couple Shoots", image: "/X/ROR/14.webp" },
      {
        title: "Corporate Offsites",
        image: "/X/HAVEN/HAVEN LIVING ROOM 4.webp",
      },
    ],
    video: "/X/Magnolia/9.webp",
    faq: [
      {
        question: "How many guests can the villa accommodate?",
        answer:
          "Haven can accommodate up to 20 guests for overnight stays across 4 spacious bedrooms. For events and celebrations, up to 100 guests can be hosted across the lawn, pool area, and indoor spaces.",
      },
      {
        question: "Is there a pool?",
        answer:
          "Yes, Haven features a private pool with a spacious wooden deck for poolside lounging and entertainment.",
      },
      {
        question: "What is the Jacuzzi Suite?",
        answer:
          "The Jacuzzi Suite is our signature room featuring a glass roof — perfect for stargazing from a private jacuzzi, making it the most romantic room at Haven.",
      },
      {
        question: "Is alcohol permitted?",
        answer:
          "Yes, guests can bring their own alcohol. Corkage charges may apply for events.",
      },
      {
        question: "Is there power backup?",
        answer:
          "Yes, the property has full generator backup ensuring uninterrupted power throughout your stay or event.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Yes, Haven is a pet-friendly property with ample lawn and garden space. We request that pets are supervised at all times.",
      },
      {
        question: "How far is Haven from the city?",
        answer:
          "Haven is located on the Hennur-Bagalur Road, approximately 40 minutes from Hebbal and 20 km from the airport, making it easily accessible while maintaining complete privacy.",
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
    image: "/X/ROR/1.webp",
    images: [
      "/X/ROR/1.webp",
      "/X/ROR/2.webp",
      "/X/ROR/3.webp",
      "/X/ROR/4.webp",
      "/X/ROR/5.webp",
      "/X/ROR/6.webp",
      "/X/ROR/7.webp",
      "/X/ROR/8.webp",
      "/X/ROR/9.webp",
      "/X/ROR/10.webp",
      "/X/ROR/11.webp",
      "/X/ROR/12.webp",
    ],
    amenities: [
      { label: "Infinity Pool", icon: "Waves" },
      { label: "Hill View", icon: "Mountain" },
      { label: "Outdoor Space", icon: "Sun" },
    ],
    spaces: [
      { name: "Infinity Pool", image: "/X/ROR/2.webp" },
      { name: "Deck Area", image: "/X/ROR/3.webp" },
      { name: "Living Room", image: "/X/ROR/4.webp" },
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
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Retreat on the Ridge, Ramanagara, Bengaluru",
      distance: "Approximately 90 minutes from Bangalore City Center",
      nearby: [
        { label: "SHOLAY HILLS", distance: "5 km away" },
        { label: "WONDERLA", distance: "20 km away" },
        { label: "BIG BANYAN", distance: "15 km away" },
      ],
    },
    activities: [
      { title: "Trekking", image: "/X/Tranquil Woods/10.webp" },
      { title: "Cycling", image: "/X/Magnolia/9.webp" },
      { title: "Bird Watching", image: "/X/ROR/14.webp" },
    ],
    video: "/X/Magnolia/9.webp",
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
  {
    id: "emerald",
    name: "Emerald",
    type: "GLASS HOUSE · COURTYARD RETREAT · PARTY RETREAT",
    location: "Near Embassy Riding School · North Bengaluru",
    stats: {
      stay: "10 Guests",
      events: "30 Guests",
      bhk: "2 BHK",
      lawn: "3,000 sqft",
      villaArea: "1,800 sqft",
    },
    description:
      "Emerald is a private pool villa designed as a traditional glasshouse around a central courtyard. This 2-bedroom villa combines indoor transparency with lush greenery, creating a setting suited for small group stays, intimate gatherings, and weekend getaways near Bangalore. With a private pool featuring an 8 ft waterfall, garden sit-outs, and courtyard living, the villa balances built space with open areas. Located 5 minutes from Embassy Riding School and 35 minutes from Hebbal, it offers accessibility with complete privacy.",
    perfectFor: ["Parties", "Staycations", "Celebrations", "Pre-wedding"],
    categories: ["Weddings", "Corporate Retreats", "Pet friendly"],
    image: "/X/ROR/10.webp",
    images: [
      "/X/ROR/6.webp",
      "/X/ROR/7.webp",
      "/X/ROR/8.webp",
      "/X/ROR/9.webp",
      "/X/ROR/10.webp",
      "/X/ROR/11.webp",
      "/X/ROR/12.webp",
    ],
    amenities: [
      {
        label: "8 ft Waterfall Pool",
        icon: "Waves",
        description:
          "A private pool with an 8-foot cascading waterfall — a striking centrepiece designed for immersive relaxation and pool parties.",
      },
      {
        label: "Central Courtyard",
        icon: "LayoutGrid",
        description:
          "Open-to-sky central courtyard with a heritage swing, connecting all living spaces with natural light and greenery.",
      },
      {
        label: "Garden Sit-out",
        icon: "Leaf",
        description:
          "Lush garden sit-out spaces for outdoor lounging, morning coffee, and alfresco dining surrounded by nature.",
      },
      {
        label: "Glasshouse Living",
        icon: "Sun",
        description:
          "Floor-to-ceiling glass walls that merge indoor luxury with outdoor landscapes — the defining feature of Emerald.",
      },
      {
        label: "Wifi",
        icon: "Wifi",
        description:
          "High-speed wireless internet throughout the villa and poolside area.",
      },
      {
        label: "Parking",
        icon: "Car",
        description:
          "Secure on-site parking with direct access to the villa entrance.",
      },
      {
        label: "Air-conditioned Bedrooms",
        icon: "Wind",
        description:
          "Both bedrooms are fully air-conditioned with premium bedding for a restful stay.",
      },
      {
        label: "Music System",
        icon: "Music",
        description:
          "Built-in sound system for poolside ambiance and party entertainment — music allowed until 10 PM outdoors.",
      },
    ],
    spaces: [
      { name: "Waterfall Pool", image: "/X/ROR/6.webp" },
      { name: "Glass House Interior", image: "/X/ROR/7.webp" },
      { name: "Central Courtyard", image: "/X/ROR/8.webp" },
      { name: "Garden Sit-out", image: "/X/ROR/9.webp" },
    ],
    services: [
      {
        title: "Chef on Call",
        description:
          "A private chef can be arranged for pool parties, brunches, and curated dining experiences — from BBQ nights to candlelight dinners.",
        footer: "Available on request. Additional charges apply",
        icon: "ChefHat",
      },
      {
        title: "Butler Service",
        description:
          "Dedicated on-site service support to manage hosted events and ensure seamless hospitality.",
        footer: "Available on request. Additional charges apply",
        icon: "User",
      },
      {
        title: "Housekeeping",
        description:
          "Daily housekeeping services during your stay to maintain the villa, pool area, and common spaces.",
        footer: "Service scope to be confirmed during booking",
        icon: "SprayCan",
      },
      {
        title: "Concierge Assistance",
        description:
          "Assistance with planning activities, nearby excursions, transportation, and logistics around your stay.",
        footer: "Available on request",
        icon: "Phone",
      },
    ],
    propertyDetails: [
      {
        label: "Traditional Glasshouse Design",
        description:
          "A unique architectural style featuring floor-to-ceiling glass walls that seamlessly blend indoor living with the surrounding lush greenery.",
        icon: "Diamond",
      },
      {
        label: "Central Courtyard with Swing",
        description:
          "An open-to-sky courtyard at the heart of the villa, featuring a heritage swing and connecting all living spaces through natural light.",
        icon: "Diamond",
      },
      {
        label: "8 ft Waterfall Private Pool",
        description:
          "A private pool with a dramatic 8-foot cascading waterfall — designed for immersive relaxation and unforgettable pool parties.",
        icon: "Diamond",
      },
      {
        label: "Prime Location",
        description:
          "Just 5 minutes from Embassy Riding School and 35 minutes from Hebbal — combining easy accessibility with complete seclusion.",
        icon: "Diamond",
      },
      {
        label: "Garden Sit-out Spaces",
        description:
          "Multiple outdoor seating areas nestled within lush gardens — ideal for lounging, reading, and alfresco dining.",
        icon: "Diamond",
      },
      {
        label: "Indoor-Outdoor Flow",
        description:
          "The glasshouse design creates a transparent living experience where every room opens to greenery, pool views, or the courtyard.",
        icon: "Diamond",
      },
      {
        label: "2 BHK Private Villa",
        description:
          "Two spacious bedrooms with premium furnishings and air-conditioning, accommodating up to 10 guests comfortably.",
        icon: "Diamond",
      },
      {
        label: "Pet-friendly Property",
        description:
          "The villa welcomes pets with ample garden space for them to explore safely under supervision.",
        icon: "Diamond",
      },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Per Villa (2 PAX)",
            sublabel: "≈ ₹10,000 / head",
            price: "₹20,000 + taxes",
          },
          { label: "Additional Guest", price: "₹2,500 + taxes" },
        ],
        features: [
          "Private pool access",
          "Overnight villa stay",
          "Complimentary breakfast",
        ],
      },
      event: {
        title: "Party Rental",
        subtitle: "12 hours (Selectable between 10 AM and 10 PM)",
        packages: [
          {
            label: "Base Package (up to 15 PAX)",
            sublabel: "≈ ₹4,333/head",
            price: "₹65,000 + taxes",
          },
          { label: "Additional Guest", price: "₹3,000 + taxes" },
        ],
        features: [
          "Pool access",
          "Garden access",
          "Music system",
          "Courtyard access",
        ],
      },
    },
    locationDetails: {
      mapImage: "/X/Magnolia/VILLA2.webp",
      address: "Emerald, Near Embassy Riding School, North Bengaluru",
      distance: "Approximately 35 minutes from Hebbal, Bangalore",
      nearby: [
        { label: "EMBASSY RIDING SCHOOL", distance: "5 min away" },
        { label: "AIRPORT", distance: "30 km away" },
        { label: "HEBBAL", distance: "35 min away" },
        { label: "HIGHWAY", distance: "5 km away" },
      ],
    },
    activities: [
      { title: "Pool Parties", image: "/X/Tranquil Woods/10.webp" },
      { title: "Romantic Stays", image: "/X/Magnolia/9.webp" },
      { title: "Pre-wedding Shoots", image: "/X/ROR/11.webp" },
      { title: "Weekend Getaways", image: "/X/ROR/12.webp" },
    ],
    video: "/X/Magnolia/9.webp",
    faq: [
      {
        question: "How many guests can the villa accommodate?",
        answer:
          "Emerald can accommodate up to 10 guests for an overnight stay across 2 bedrooms. For events and parties, up to 30 guests can be hosted.",
      },
      {
        question: "Is there a pool?",
        answer:
          "Yes, the villa features a private pool with a dramatic 8-foot cascading waterfall — one of the signature features of Emerald.",
      },
      {
        question: "Is music allowed?",
        answer:
          "Yes, music is allowed until 10 PM in outdoor areas. After 10 PM, the built-in indoor sound system can be used at a reasonable volume.",
      },
      {
        question: "Is food included?",
        answer:
          "Complimentary breakfast is included with overnight stays. Additional meals can be ordered from our in-house menu or prepared by a private chef on request.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Yes, Emerald is a pet-friendly property with ample garden space. We request that pets are supervised at all times.",
      },
      {
        question: "What is the check-in and check-out time?",
        answer:
          "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is subject to availability.",
      },
      {
        question: "How far is Emerald from the city?",
        answer:
          "Emerald is approximately 35 minutes from Hebbal and 5 minutes from Embassy Riding School, making it easily accessible while maintaining complete privacy.",
      },
    ],
  },
  {
    id: "wonderland-treehouse",
    name: "Wonderland Treehouse",
    type: "NATURE-THEMED BOUTIQUE STAY",
    location: "Doddaballapur",
    stats: { stay: "6 Guests", events: "8 Guests", bhk: "2 BHK" },
    description:
      "Experience the magic of slow living in our boutique treehouse-themed villa. Perfect for intimate groups, this cozy 2-BHK property offers a unique connection with nature, featuring rustic architecture and serene views.",
    perfectFor: ["Slow Living", "Intimate Gatherings", "Romantic Stays"],
    categories: ["Pre-wedding", "Pet friendly"],
    image: "/X/Magnolia/14.webp",
    images: [
      "/X/Magnolia/14.webp",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "/X/Magnolia/16.webp",
      "/X/Magnolia/17.webp",
      "/X/Magnolia/18.webp",
      "/X/Magnolia/19.webp",
      "/X/Magnolia/22.webp",
      "/X/Magnolia/VILLA.webp",
    ],
    amenities: [
      { label: "Treehouse Deck", icon: "Home" },
      { label: "Nature View", icon: "Mountain" },
      { label: "Cozy Interiors", icon: "Wind" },
    ],
    spaces: [
      {
        name: "Main Deck",
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      },
      { name: "Cozy Room", image: "/X/Magnolia/16.webp" },
    ],
    services: [
      {
        title: "Breakfast Included",
        description: "Traditional Karnataka breakfast.",
        icon: "ChefHat",
      },
    ],
    propertyDetails: [
      {
        title: "2-BHK Treehouse",
        description: "Rustic charm with modern comforts.",
      },
    ],
    pricing: {
      event: {
        title: "Boutique Stay",
        subtitle: "22 hours",
        packages: [{ label: "Standard Stay", price: "₹30,000 onwards" }],
        features: ["Breakfast", "Nature Trail"],
      },
    },
    locationDetails: {
      address: "Wonderland Treehouse, Doddaballapur, Bangalore",
    },
    activities: [{ title: "Nature Walks", image: "/X/Tranquil Woods/10.webp" }],
    video: "/X/Magnolia/9.webp",
    faq: [{ question: "Is it safe?", answer: "Yes, fully secured and gated." }],
  },
  {
    id: "jade-735",
    name: "Jade 735",
    type: "PRIVATE POOL VILLA RETREAT",
    location: "Devanahalli · Bangalore",
    shortDescription:
      "A luxurious 4BHK retreat with a private pool, ideal for intimate gatherings and private escapes.",
    description:
      "A luxurious 4BHK retreat with a private pool, ideal for intimate gatherings and private escapes.",
    thumbnail: "/images/retreats/735/735-thumb.jpg",
    image: "/images/retreats/735/735-thumb.jpg",
    images: [
      "/images/retreats/735/735-1.jpg",
      "/images/retreats/735/735-2.jpg",
      "/images/retreats/735/735-3.jpg",
      "/images/retreats/735/735-4.jpg",
      "/images/retreats/735/735-5.jpg",
    ],
    stats: {
      stay: "10 Guests",
      events: "60 Guests",
      bhk: "4 BHK",
      villaArea: "3500 Sq.Ft Villa",
      lawn: "2 Lawns",
    },
    propertyDetails: [
      {
        label: "4 Bedrooms",
        icon: "Bed",
        description: "Spacious luxury bedrooms.",
      },
      {
        label: "4 Bathrooms",
        icon: "Bath",
        description: "En-suite modern bathrooms.",
      },
      {
        label: "1 Kitchen",
        icon: "ChefHat",
        description: "Fully equipped kitchen.",
      },
      {
        label: "3 Living Rooms",
        icon: "Sofa",
        description: "Comfortable lounge areas.",
      },
      {
        label: "Dedicated Staff",
        icon: "Users",
        description: "On-site staff assistance.",
      },
      {
        label: "2 Lawns",
        icon: "Trees",
        description: "Spacious outdoor lawns.",
      },
      {
        label: "3500 Sq.Ft Villa",
        icon: "Maximize",
        description: "Large layout.",
      },
      {
        label: "Daily Housekeeping",
        icon: "Sparkles",
        description: "Cleaning services.",
      },
    ],
    amenities: [
      {
        label: "Intimate Gatherings",
        description: "Perfect setting for small celebrations.",
        icon: "Users",
      },
      {
        label: "Custom Decor",
        description: "Personalized event arrangements.",
        icon: "Sparkles",
      },
      {
        label: "Catering & Bar",
        description: "Premium food and beverage options.",
        icon: "Utensils",
      },
      {
        label: "Swimming Pool",
        description: "Private temperature-controlled pool.",
        icon: "Waves",
      },
      {
        label: "Dedicated Service",
        description: "Professional on-site staff.",
        icon: "UserCheck",
      },
      {
        label: "Entertainment",
        description: "Premium audio-visual setup.",
        icon: "Music",
      },
      {
        label: "Bonfire/BBQ",
        description: "Outdoor dining and bonfire setup.",
        icon: "Flame",
      },
      {
        label: "Serene Backdrops",
        description: "Lush green surroundings for events.",
        icon: "Mountain",
      },
    ],
    services: [
      {
        title: "Chef & Catering",
        description:
          "Curated menus crafted by our expert culinary team for every occasion.",
        icon: "ChefHat",
        footer: "Available on request. Additional charges apply",
      },
      {
        title: "Event Decor",
        description:
          "Bespoke setups transforming spaces to match your vision perfectly.",
        icon: "Sparkles",
        footer: "Custom pricing based on requirements",
      },
      {
        title: "Entertainment",
        description:
          "DJ, live bands, and ambient music arrangements for your events.",
        icon: "Music",
        footer: "Requires prior booking",
      },
      {
        title: "Photography",
        description:
          "Capture your precious moments with professional photography services.",
        icon: "Camera",
        footer: "Available in multiple packages",
      },
    ],
    categories: ["Villas", "Event Spaces"],
    perfectFor: [
      "Private Escapes",
      "Intimate Gatherings",
      "Corporate Offsites",
      "Weekend Getaways",
    ],
    activities: [
      { title: "Pool Party", image: "/images/activities/pool.jpg" },
      { title: "BBQ Night", image: "/images/activities/bbq.jpg" },
      { title: "Board Games", image: "/images/activities/games.jpg" },
      { title: "Outdoor Dining", image: "/images/activities/dining.jpg" },
    ],
    spaces: [
      { name: "Private Pool", image: "/images/spaces/pool.jpg" },
      { name: "Main Lawn", image: "/images/spaces/lawn.jpg" },
      { name: "Lounge Areas", image: "/images/spaces/lounge.jpg" },
      { name: "Terrace Space", image: "/images/spaces/terrace.jpg" },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "₹68,000 + taxes",
          },
        ],
        features: [
          "Venue access",
          "Overnight villa stay",
          "Private pool access",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/jade-735.jpg",
      address: "Jade 735, Devanahalli, Bangalore",
      distance: "Near Airport",
      nearby: [{ label: "AIRPORT", distance: "10 mins" }],
    },
    video: "/images/retreats/735/video.jpg",
    faq: [
      {
        question: "Is the pool strictly private?",
        answer:
          "[INFERRED] Yes, the swimming pool is completely private and accessible only to the guests staying at Jade 735.",
      },
      {
        question: "Can we invite day visitors for a party?",
        answer:
          "[INFERRED] Yes, day visitors can be accommodated for events up to 60 guests. Additional charges may apply per visitor.",
      },
      {
        question: "Is outside food allowed?",
        answer:
          "[INFERRED] While we have excellent in-house catering, outside food arrangements can be discussed based on your specific requirements.",
      },
      {
        question: "Are pets allowed at the property?",
        answer:
          "[INFERRED] Jade 735 is a pet-friendly retreat. Please inform us in advance so we can arrange accordingly.",
      },
      {
        question: "Is loud music permitted outdoors?",
        answer:
          "[INFERRED] Music is permitted within reasonable limits and in accordance with local regulations regarding outdoor sound.",
      },
      {
        question: "Do you have a power backup?",
        answer:
          "[INFERRED] Yes, the property is equipped with a full capacity generator for uninterrupted power supply.",
      },
      {
        question: "Are the lawns suitable for a small wedding?",
        answer:
          "[INFERRED] Absolutely. The two lawns combined can host intimate weddings and ceremonies for up to 60 guests.",
      },
    ],
  },
  {
    id: "lemon-tree",
    name: "Lemon Tree",
    type: "HILL-VIEW FARMHOUSE RETREAT",
    location: "[INFERRED] Nandi Hills Area",
    shortDescription:
      "[INFERRED] A scenic 3BHK farmhouse retreat offering lush hill views, ideal for weekend getaways and small events up to 40 guests.",
    description:
      "[INFERRED] Surrounded by nature, Lemon Tree is a tranquil 3BHK farmhouse that provides a perfect escape from the city. Featuring expansive lawns and panoramic hill views, it is designed for memorable weekend stays for up to 14 guests and intimate events for up to 40 guests.",
    thumbnail: "/images/retreats/lemon/lemon-thumb.jpg",
    image: "/images/retreats/lemon/lemon-thumb.jpg",
    images: [
      "/images/retreats/lemon/lemon-1.jpg",
      "/images/retreats/lemon/lemon-2.jpg",
      "/images/retreats/lemon/lemon-3.jpg",
      "/images/retreats/lemon/lemon-4.jpg",
      "/images/retreats/lemon/lemon-5.jpg",
    ],
    stats: {
      stay: "14 Guests",
      events: "40 Guests",
      bhk: "3 BHK",
      villaArea: "[INFERRED] 4500 Sq.Ft Farmhouse",
      lawn: "[INFERRED] Large View Lawn",
    },
    propertyDetails: [
      {
        label: "3 Bedrooms",
        icon: "Bed",
        description: "[INFERRED] Cozy hill-view bedrooms.",
      },
      {
        label: "3 Bathrooms",
        icon: "Bath",
        description: "[INFERRED] Attached modern bathrooms.",
      },
      {
        label: "1 Kitchen",
        icon: "ChefHat",
        description: "[INFERRED] Fully equipped kitchen.",
      },
      {
        label: "Open Living Area",
        icon: "Sofa",
        description: "[INFERRED] Spacious lounge with views.",
      },
      {
        label: "Dedicated Staff",
        icon: "Users",
        description: "[INFERRED] On-site caretaker and staff.",
      },
      {
        label: "Scenic Lawn",
        icon: "Trees",
        description: "[INFERRED] Expansive outdoor green space.",
      },
      {
        label: "Farmhouse Architecture",
        icon: "Home",
        description: "[INFERRED] Rustic yet luxurious design.",
      },
      {
        label: "Daily Housekeeping",
        icon: "Sparkles",
        description: "[INFERRED] Regular cleaning services included.",
      },
    ],
    amenities: [
      {
        label: "Hill Views",
        description: "[INFERRED] Beautiful panoramic views of Nandi Hills.",
        icon: "Mountain",
      },
      {
        label: "Intimate Events",
        description: "[INFERRED] Perfect setting for up to 40 guests.",
        icon: "PartyPopper",
      },
      {
        label: "Outdoor Dining",
        description: "[INFERRED] Alfresco dining setup amidst nature.",
        icon: "Utensils",
      },
      {
        label: "Private Garden",
        description: "[INFERRED] Exquisitely maintained private garden area.",
        icon: "Leaf",
      },
      {
        label: "Dedicated Service",
        description: "[INFERRED] Professional on-site staff for assistance.",
        icon: "UserCheck",
      },
      {
        label: "Entertainment Setup",
        description: "[INFERRED] Sound system and TV available.",
        icon: "Music",
      },
      {
        label: "Bonfire & BBQ",
        description: "[INFERRED] Enjoy evenings with a customized bonfire/BBQ.",
        icon: "Flame",
      },
      {
        label: "Pet Friendly",
        description: "[INFERRED] Wide open spaces perfect for pets to roam.",
        icon: "Dog",
      },
    ],
    services: [
      {
        title: "Chef & Catering",
        description:
          "[INFERRED] Curated menus featuring local farm-fresh ingredients.",
        icon: "ChefHat",
        footer: "[INFERRED] Available on request. Additional charges apply",
      },
      {
        title: "Event Setup",
        description:
          "[INFERRED] Beautiful rustic decor arrangements for your celebrations.",
        icon: "Sparkles",
        footer: "[INFERRED] Custom pricing based on requirements",
      },
      {
        title: "Bonfire Evenings",
        description:
          "[INFERRED] Cozy fire arrangements under the starry night sky.",
        icon: "Flame",
        footer: "[INFERRED] Requires prior booking",
      },
      {
        title: "Photography",
        description:
          "[INFERRED] Capture the natural beauty and memorable moments.",
        icon: "Camera",
        footer: "[INFERRED] Available in multiple packages",
      },
    ],
    categories: ["Villas", "Pet friendly"],
    perfectFor: [
      "Weekend Getaways",
      "Nature Escapes",
      "Small Celebrations",
      "Family Retreats",
    ],
    activities: [
      {
        title: "[INFERRED] Nature Treks",
        image: "/images/activities/trek.jpg",
      },
      { title: "[INFERRED] BBQ Setup", image: "/images/activities/bbq.jpg" },
      {
        title: "[INFERRED] Star Gazing",
        image: "/images/activities/stars.jpg",
      },
      { title: "[INFERRED] Lawn Games", image: "/images/activities/games.jpg" },
    ],
    spaces: [
      {
        name: "[INFERRED] Hill View Lawn",
        image: "/images/spaces/view-lawn.jpg",
      },
      { name: "[INFERRED] Farmhouse Porch", image: "/images/spaces/porch.jpg" },
      { name: "[INFERRED] Living Room", image: "/images/spaces/living.jpg" },
      { name: "[INFERRED] Garden Path", image: "/images/spaces/garden.jpg" },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹42,000 + taxes",
          },
        ],
        features: [
          "Venue access",
          "Overnight farmhouse stay",
          "Dedicated Caretaker",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/lemon-tree.jpg",
      address: "[INFERRED] Lemon Tree, near Nandi Hills, Bangalore",
      distance: "[INFERRED] Approx 1 hour from the city",
      nearby: [{ label: "NANDI HILLS", distance: "20 mins" }],
    },
    video: "/images/retreats/lemon/video.jpg",
    faq: [
      {
        question: "Is the property wheelchair accessible?",
        answer:
          "[INFERRED] Yes, the ground floor of the farmhouse and the main lawns are easily accessible.",
      },
      {
        question: "Can we host a loud party?",
        answer:
          "[INFERRED] As it is a serene nature retreat, loud music is restricted outdoors past 10 PM. Indoor music is allowed.",
      },
      {
        question: "Is outside catering allowed?",
        answer:
          "[INFERRED] Yes, for events up to 40 guests, outside catering is permitted with prior management approval.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "[INFERRED] Yes, Lemon Tree is a pet-friendly property with ample open space for them to roam.",
      },
      {
        question: "Do you provide BBQ equipment?",
        answer:
          "[INFERRED] Yes, a BBQ setup and bonfire can be arranged upon request for an additional charge.",
      },
      {
        question: "Is there a swimming pool?",
        answer:
          "[INFERRED] No, this specific farmhouse focuses on expansive lawns and hill views rather than a pool.",
      },
      {
        question: "Are the bedrooms air-conditioned?",
        answer:
          "[INFERRED] Yes, all 3 bedrooms feature air-conditioning for your continuous comfort.",
      },
    ],
  },
  {
    id: "lounge-fly",
    name: "Lounge Fly",
    type: "PREMIUM LOUNGE RETREAT",
    location: "[INFERRED] Bangalore City Outskirts",
    shortDescription:
      "[INFERRED] A stylish, modern lounge retreat designed for vibrant parties, casual get-togethers, and relaxed weekend stays for up to 30 guests.",
    description:
      "[INFERRED] Experience the ultimate party vibe at Lounge Fly. Boasting chic interiors, high-end entertainment systems, and dynamic outdoor spaces, it is the perfect venue for celebrations and exclusive weekend stays.",
    thumbnail: "/images/retreats/lounge/lounge-thumb.jpg",
    image: "/images/retreats/lounge/lounge-thumb.jpg",
    images: [
      "/images/retreats/lounge/lounge-1.jpg",
      "/images/retreats/lounge/lounge-2.jpg",
      "/images/retreats/lounge/lounge-3.jpg",
      "/images/retreats/lounge/lounge-4.jpg",
      "/images/retreats/lounge/lounge-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 12 Guests",
      events: "[INFERRED] 30 Guests",
      bhk: "[INFERRED] 3 BHK",
      villaArea: "[INFERRED] 3000 Sq.Ft Lounge",
      lawn: "[INFERRED] 1 Party Deck",
    },
    propertyDetails: [
      {
        label: "3 Bedrooms",
        icon: "Bed",
        description: "[INFERRED] Modern, comfortable bedrooms.",
      },
      {
        label: "3 Bathrooms",
        icon: "Bath",
        description: "[INFERRED] Well-appointed bathrooms.",
      },
      {
        label: "1 Kitchen",
        icon: "ChefHat",
        description: "[INFERRED] Fully equipped for party prep.",
      },
      {
        label: "Party Lounge",
        icon: "Sofa",
        description: "[INFERRED] Spacious indoor entertaining area.",
      },
      {
        label: "Dedicated Staff",
        icon: "Users",
        description: "[INFERRED] Host and service staff.",
      },
      {
        label: "Open Deck",
        icon: "Trees",
        description: "[INFERRED] Outdoor space for socializing.",
      },
      {
        label: "Modern Architecture",
        icon: "Home",
        description: "[INFERRED] Contemporary party design.",
      },
      {
        label: "Daily Housekeeping",
        icon: "Sparkles",
        description: "[INFERRED] Cleaning pre/post event.",
      },
    ],
    amenities: [
      {
        label: "DJ/Music Setup",
        description: "[INFERRED] Premium sound system for parties.",
        icon: "Music",
      },
      {
        label: "Cocktail Bar Setup",
        description: "[INFERRED] Dedicated area for mixing drinks.",
        icon: "GlassWater",
      },
      {
        label: "Party Lighting",
        description: "[INFERRED] Dynamic ambient lighting.",
        icon: "Sparkles",
      },
      {
        label: "Lounge Seating",
        description: "[INFERRED] Plush, extensive seating arrangements.",
        icon: "Sofa",
      },
      {
        label: "Dedicated Service",
        description: "[INFERRED] Professional on-site staff.",
        icon: "UserCheck",
      },
      {
        label: "Outdoor Deck",
        description: "[INFERRED] Perfect for evening socials.",
        icon: "Sunset",
      },
      {
        label: "Bonfire & BBQ",
        description: "[INFERRED] Outdoor grill options.",
        icon: "Flame",
      },
      {
        label: "Wi-Fi included",
        description: "[INFERRED] High-speed internet access.",
        icon: "Wifi",
      },
    ],
    services: [
      {
        title: "Chef & Catering",
        description: "[INFERRED] Curated party menus and snacks.",
        icon: "ChefHat",
        footer: "[INFERRED] Available on request. Additional charges apply",
      },
      {
        title: "Event Decor",
        description: "[INFERRED] Thematic party setups.",
        icon: "Sparkles",
        footer: "[INFERRED] Custom pricing based on requirements",
      },
      {
        title: "DJ Services",
        description: "[INFERRED] Professional DJ and sound setup.",
        icon: "Music",
        footer: "[INFERRED] Requires prior booking",
      },
      {
        title: "Photography",
        description: "[INFERRED] Event photography coverage.",
        icon: "Camera",
        footer: "[INFERRED] Available in multiple packages",
      },
    ],
    categories: ["Villas", "Event Spaces"],
    perfectFor: [
      "Birthday Parties",
      "Bachelors Parties",
      "Weekend Bashes",
      "Friends Getaways",
    ],
    activities: [
      { title: "[INFERRED] DJ Night", image: "/images/activities/dj.jpg" },
      { title: "[INFERRED] Mixology", image: "/images/activities/bar.jpg" },
      {
        title: "[INFERRED] Board Games",
        image: "/images/activities/games.jpg",
      },
      { title: "[INFERRED] BBQ Dinner", image: "/images/activities/bbq.jpg" },
    ],
    spaces: [
      {
        name: "[INFERRED] Main Lounge",
        image: "/images/spaces/lounge-main.jpg",
      },
      { name: "[INFERRED] Party Deck", image: "/images/spaces/deck.jpg" },
      { name: "[INFERRED] Bar Area", image: "/images/spaces/bar-area.jpg" },
      { name: "[INFERRED] Master Suite", image: "/images/spaces/suite.jpg" },
    ],
    pricing: {
      stay: {
        title: "Stay Experience",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹45,000 + taxes",
          },
        ],
        features: ["Venue access", "Overnight stay", "Sound system access"],
      },
    },
    locationDetails: {
      mapImage: "/images/map/lounge-fly.jpg",
      address: "[INFERRED] Lounge Fly Location, Bangalore",
      distance: "[INFERRED] Within city limits",
      nearby: [{ label: "CITY CENTER", distance: "30 mins" }],
    },
    video: "/images/retreats/lounge/video.jpg",
    faq: [
      {
        question: "Can we hire an outside DJ?",
        answer:
          "[INFERRED] Yes, but please ensure volume limits are respected post 10 PM outdoors.",
      },
      {
        question: "Is alcohol permitted?",
        answer:
          "[INFERRED] You may bring your own beverages for private consumption inside the retreat.",
      },
      {
        question: "Are bachelor parties allowed?",
        answer:
          "[INFERRED] Yes, Lounge Fly is perfectly suited for lively parties and gatherings.",
      },
      {
        question: "Is outside catering allowed?",
        answer:
          "[INFERRED] Yes, outside food is allowed with an added clean-up charge if required.",
      },
      {
        question: "Do you provide BBQ equipment?",
        answer:
          "[INFERRED] Yes, a BBQ setup can be arranged on the outdoor deck upon request for an additional charge.",
      },
      {
        question: "Is there a pool?",
        answer:
          "[INFERRED] Lounge Fly primarily features premium party spaces and a large deck.",
      },
      {
        question: "Are the bedrooms air-conditioned?",
        answer: "[INFERRED] Yes, all bedrooms are air-conditioned.",
      },
    ],
  },
  {
    id: "magnolia",
    name: "Magnolia",
    type: "PREMIUM LUXURY RETREAT",
    location: "[INFERRED] Serene Outskirts, Bangalore",
    shortDescription:
      "[INFERRED] An exquisite luxury retreat surrounded by lush greenery, perfect for intimate gatherings, elegant stays, and premium weekend escapes.",
    description:
      "[INFERRED] Discover the tranquility of Magnolia. This opulent retreat merges classic architecture with modern amenities, offering expansive lawns, plush interiors, and highly personalized services for an unforgettable experience.",
    thumbnail: "/images/retreats/magnolia/magnolia-thumb.jpg",
    image: "/images/retreats/magnolia/magnolia-thumb.jpg",
    images: [
      "/images/retreats/magnolia/magnolia-1.jpg",
      "/images/retreats/magnolia/magnolia-2.jpg",
      "/images/retreats/magnolia/magnolia-3.jpg",
      "/images/retreats/magnolia/magnolia-4.jpg",
      "/images/retreats/magnolia/magnolia-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 14 Guests",
      events: "[INFERRED] 40 Guests",
      bhk: "[INFERRED] 4 BHK",
      villaArea: "[INFERRED] 4000 Sq.Ft Villa",
      lawn: "[INFERRED] Landscaped Gardens",
    },
    propertyDetails: [
      {
        label: "4 Grand Suites",
        icon: "Bed",
        description: "[INFERRED] Spacious bedrooms with premium bedding.",
      },
      {
        label: "4 En-suite Baths",
        icon: "Bath",
        description: "[INFERRED] Luxury bath fittings and amenities.",
      },
      {
        label: "Gourmet Kitchen",
        icon: "ChefHat",
        description: "[INFERRED] Fully equipped for private chefs.",
      },
      {
        label: "Elegant Living Room",
        icon: "Sofa",
        description: "[INFERRED] Sophisticated indoor seating.",
      },
      {
        label: "Personal Butler",
        icon: "Users",
        description: "[INFERRED] Dedicated 24/7 service staff.",
      },
      {
        label: "Private Gardens",
        icon: "Trees",
        description: "[INFERRED] Sprawling manicured lawns.",
      },
      {
        label: "Classic Architecture",
        icon: "Home",
        description: "[INFERRED] Timeless elegant design.",
      },
      {
        label: "Daily Housekeeping",
        icon: "Sparkles",
        description: "[INFERRED] Immaculate cleanliness maintained.",
      },
    ],
    amenities: [
      {
        label: "Private Pool",
        description: "[INFERRED] Temperature-controlled swimming pool.",
        icon: "Droplets",
      },
      {
        label: "Outdoor Dining",
        description: "[INFERRED] Al fresco dining under the stars.",
        icon: "Coffee",
      },
      {
        label: "Smart Entertainment",
        description: "[INFERRED] Premium AV and streaming systems.",
        icon: "Tv",
      },
      {
        label: "Plush Lounges",
        description: "[INFERRED] Comfortable relaxation spaces.",
        icon: "Sofa",
      },
      {
        label: "Dedicated Staff",
        description: "[INFERRED] On-site professional assistance.",
        icon: "UserCheck",
      },
      {
        label: "Sunset Deck",
        description: "[INFERRED] Elevated viewpoints for evenings.",
        icon: "Sunset",
      },
      {
        label: "BBQ Setup",
        description: "[INFERRED] Outdoor grilling stations available.",
        icon: "Flame",
      },
      {
        label: "High-Speed Wi-Fi",
        description: "[INFERRED] Seamless connectivity.",
        icon: "Wifi",
      },
    ],
    services: [
      {
        title: "Gourmet Dining",
        description:
          "[INFERRED] In-house chef preparing tailored multi-course meals.",
        icon: "ChefHat",
        footer: "[INFERRED] Breakfast included. Lunch/Dinner extra",
      },
      {
        title: "Spa & Wellness",
        description: "[INFERRED] On-demand massage and wellness therapies.",
        icon: "Sparkles",
        footer: "[INFERRED] Requires 24-hour advance booking",
      },
      {
        title: "Bespoke Celebrations",
        description: "[INFERRED] Specialized decor and event management.",
        icon: "Gift",
        footer: "[INFERRED] Priced per event requirements",
      },
      {
        title: "Chauffeur Services",
        description: "[INFERRED] Premium luxury airport transfers.",
        icon: "Car",
        footer: "[INFERRED] Bookable as an add-on",
      },
    ],
    categories: ["Villas", "Luxury Stays"],
    perfectFor: [
      "Family Vacations",
      "Intimate Celebrations",
      "Bridal Showers",
      "Corporate Offsites",
    ],
    activities: [
      {
        title: "[INFERRED] Poolside Brunch",
        image: "/images/activities/brunch.jpg",
      },
      { title: "[INFERRED] Garden Yoga", image: "/images/activities/yoga.jpg" },
      {
        title: "[INFERRED] Movie Night",
        image: "/images/activities/movie.jpg",
      },
      {
        title: "[INFERRED] Fine Dining",
        image: "/images/activities/dining.jpg",
      },
    ],
    spaces: [
      {
        name: "[INFERRED] The Grand Lawn",
        image: "/images/spaces/magnolia-lawn.jpg",
      },
      {
        name: "[INFERRED] Infinity Pool",
        image: "/images/spaces/magnolia-pool.jpg",
      },
      {
        name: "[INFERRED] Master Bedroom",
        image: "/images/spaces/magnolia-room.jpg",
      },
      {
        name: "[INFERRED] Elegant Living",
        image: "/images/spaces/magnolia-living.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Luxury Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹55,000 + taxes",
          },
        ],
        features: [
          "Private villa access",
          "Butler service",
          "Welcome amenities",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/magnolia.jpg",
      address: "[INFERRED] Magnolia Estate, Bangalore",
      distance: "[INFERRED] 45 mins from CBD",
      nearby: [{ label: "AIRPORT", distance: "60 mins" }],
    },
    video: "/images/retreats/magnolia/video.jpg",
    faq: [
      {
        question: "Is Magnolia pet-friendly?",
        answer:
          "[INFERRED] Yes, well-trained pets are welcome with prior approval.",
      },
      {
        question: "Is there a private chef available?",
        answer:
          "[INFERRED] Yes, a private chef can be arranged to curate menus according to your dietary preferences.",
      },
      {
        question: "Can we host a wedding here?",
        answer:
          "[INFERRED] Magnolia is ideal for intimate weddings and pre-wedding functions for up to 40 guests.",
      },
      {
        question: "Is the pool heated?",
        answer:
          "[INFERRED] Yes, the private pool is temperature-controlled for comfort.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "[INFERRED] Cancellations made 14 days prior to check-in are fully refundable.",
      },
      {
        question: "Is Wi-Fi available everywhere?",
        answer:
          "[INFERRED] Yes, high-speed Wi-Fi covers the indoor spaces and main deck.",
      },
      {
        question: "Are airport transfers provided?",
        answer:
          "[INFERRED] Yes, luxury airport transfers can be arranged at an additional cost.",
      },
    ],
  },
  {
    id: "palatio",
    name: "Palatio",
    type: "GRAND PALATIAL RETREAT",
    location: "[INFERRED] Legacy Estates, Bangalore",
    shortDescription:
      "[INFERRED] A majestic luxury retreat inspired by royal architecture, featuring sprawling courtyards, opulent interiors, and world-class hospitality.",
    description:
      "[INFERRED] Experience the grandeur of Palatio. Designed with intricate architectural details and vast open spaces, this retreat offers a regal getaway perfect for high-profile events, luxury stays, and exclusive celebrations.",
    thumbnail: "/images/retreats/palatio/palatio-thumb.jpg",
    image: "/images/retreats/palatio/palatio-thumb.jpg",
    images: [
      "/images/retreats/palatio/palatio-1.jpg",
      "/images/retreats/palatio/palatio-2.jpg",
      "/images/retreats/palatio/palatio-3.jpg",
      "/images/retreats/palatio/palatio-4.jpg",
      "/images/retreats/palatio/palatio-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 16 Guests",
      events: "[INFERRED] 150 Guests",
      bhk: "[INFERRED] 5 BHK",
      villaArea: "[INFERRED] 8000 Sq.Ft Estate",
      lawn: "[INFERRED] Royal Courtyards",
    },
    propertyDetails: [
      {
        label: "5 Royal Suites",
        icon: "Bed",
        description:
          "[INFERRED] Exceptionally spacious bedrooms designed for royalty.",
      },
      {
        label: "5 Regal Baths",
        icon: "Bath",
        description:
          "[INFERRED] Marble-clad en-suite bathrooms with premium amenities.",
      },
      {
        label: "Banquet Hall",
        icon: "Home",
        description: "[INFERRED] Grand indoor space for dining and events.",
      },
      {
        label: "Master Kitchen",
        icon: "ChefHat",
        description: "[INFERRED] Commercial-grade kitchen for large catering.",
      },
      {
        label: "Estate Manager",
        icon: "Users",
        description: "[INFERRED] Dedicated management and service staff.",
      },
      {
        label: "Central Courtyard",
        icon: "Trees",
        description: "[INFERRED] Expansive outdoor gathering spaces.",
      },
      {
        label: "Palatial Design",
        icon: "Sparkles",
        description: "[INFERRED] Heritage-inspired aesthetic.",
      },
      {
        label: "Valet Service",
        icon: "Car",
        description: "[INFERRED] On-demand luxury transport assistance.",
      },
    ],
    amenities: [
      {
        label: "Grand Pool",
        description: "[INFERRED] Massive temperature-controlled swimming pool.",
        icon: "Droplets",
      },
      {
        label: "Terrace Lounge",
        description: "[INFERRED] Elevated spaces with panoramic views.",
        icon: "Coffee",
      },
      {
        label: "Media Room",
        description: "[INFERRED] Dedicated cinema and entertainment zone.",
        icon: "Tv",
      },
      {
        label: "Formal Dining",
        description: "[INFERRED] Exquisite multi-seat dining area.",
        icon: "Utensils",
      },
      {
        label: "24/7 Security",
        description: "[INFERRED] Complete privacy and protection.",
        icon: "Shield",
      },
      {
        label: "Spa Facilities",
        description: "[INFERRED] In-house wellness and massage rooms.",
        icon: "Sparkles",
      },
      {
        label: "Games Room",
        description: "[INFERRED] Billiards, table tennis, and indoor sports.",
        icon: "Gamepad2",
      },
      {
        label: "High-Speed Wi-Fi",
        description: "[INFERRED] Enterprise-grade connectivity.",
        icon: "Wifi",
      },
    ],
    services: [
      {
        title: "Royal Banquet",
        description:
          "[INFERRED] Complete catering solutions for up to 150 guests.",
        icon: "ChefHat",
        footer: "[INFERRED] Customizable menus.",
      },
      {
        title: "Event Concierge",
        description:
          "[INFERRED] Dedicated planners for large-scale celebrations.",
        icon: "Calendar",
        footer: "[INFERRED] Requires advance booking.",
      },
      {
        title: "Chauffeur Fleet",
        description: "[INFERRED] Luxury vehicles for group transfers.",
        icon: "Car",
        footer: "[INFERRED] Available upon request.",
      },
      {
        title: "Wellness Retreat",
        description: "[INFERRED] Private yoga and spa sessions.",
        icon: "Heart",
        footer: "[INFERRED] Bookable as an add-on.",
      },
    ],
    categories: ["Villas", "Luxury Stays", "Event Spaces"],
    perfectFor: [
      "Grand Weddings",
      "Corporate Galas",
      "Generational Family Stays",
      "High-Profile Events",
    ],
    activities: [
      {
        title: "[INFERRED] Royal Dining",
        image: "/images/activities/royal-dining.jpg",
      },
      {
        title: "[INFERRED] Courtyard Events",
        image: "/images/activities/courtyard.jpg",
      },
      { title: "[INFERRED] Spa Sessions", image: "/images/activities/spa.jpg" },
      {
        title: "[INFERRED] Poolside Galas",
        image: "/images/activities/gala.jpg",
      },
    ],
    spaces: [
      {
        name: "[INFERRED] The Grand Hall",
        image: "/images/spaces/palatio-hall.jpg",
      },
      {
        name: "[INFERRED] Royal Suite",
        image: "/images/spaces/palatio-suite.jpg",
      },
      {
        name: "[INFERRED] Central Courtyard",
        image: "/images/spaces/palatio-courtyard.jpg",
      },
      {
        name: "[INFERRED] Terraced Lawns",
        image: "/images/spaces/palatio-lawns.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Grand Estate Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹1,20,000 + taxes",
          },
        ],
        features: [
          "Complete estate access",
          "Full service team",
          "Welcome banquet",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/palatio.jpg",
      address: "[INFERRED] Legacy Estates, Bangalore",
      distance: "[INFERRED] 50 mins from CBD",
      nearby: [{ label: "AIRPORT", distance: "65 mins" }],
    },
    video: "/images/retreats/palatio/video.jpg",
    faq: [
      {
        question: "Can Palatio accommodate large events?",
        answer:
          "[INFERRED] Yes, the estate is designed for events of up to 150 guests across its courtyards and halls.",
      },
      {
        question: "Is there an in-house catering team?",
        answer:
          "[INFERRED] We provide access to elite catering partners, or you can bring your own vendors with prior approval.",
      },
      {
        question: "How many cars can be parked on-site?",
        answer:
          "[INFERRED] Palatio features extensive parking space with valet services capable of handling up to 40 vehicles.",
      },
      {
        question: "Are there noise restrictions for outdoor events?",
        answer:
          "[INFERRED] Outdoor music is permitted up to 10 PM in accordance with local regulations, after which events can move indoors.",
      },
      {
        question: "Is the estate wheelchair accessible?",
        answer:
          "[INFERRED] Yes, the ground floor suites and major event spaces are fully accessible.",
      },
      {
        question: "What is the cancellation policy for large bookings?",
        answer:
          "[INFERRED] For event bookings, cancellations made 30 days prior are eligible for a partial refund. Full details are provided in the booking contract.",
      },
      {
        question: "Can we book Palatio for just a stay without an event?",
        answer:
          "[INFERRED] Absolutely, it serves as a magnificent private getaway for up to 16 residing guests.",
      },
    ],
  },
  {
    id: "retreat-on-the-ridge",
    name: "Retreat on the Ridge",
    type: "LAVISH HILLTOP SANCTUARY",
    location: "[INFERRED] Nandi Hills, Bangalore",
    shortDescription:
      "[INFERRED] An architectural masterpiece perched on a ridge, offering uninterrupted panoramic views, infinity pools, and ultra-luxury living.",
    description:
      "[INFERRED] Elevate your getaway experience at Retreat on the Ridge. Nestled high above the city, this sanctuary combines striking modern design with the tranquility of nature. Experience edge-of-the-world living with floor-to-ceiling glass walls, sprawling decks, and an infinity pool that blends into the horizon.",
    thumbnail: "/images/retreats/retreat-on-the-ridge/rotr-thumb.jpg",
    image: "/images/retreats/retreat-on-the-ridge/rotr-thumb.jpg",
    images: [
      "/images/retreats/retreat-on-the-ridge/rotr-1.jpg",
      "/images/retreats/retreat-on-the-ridge/rotr-2.jpg",
      "/images/retreats/retreat-on-the-ridge/rotr-3.jpg",
      "/images/retreats/retreat-on-the-ridge/rotr-4.jpg",
      "/images/retreats/retreat-on-the-ridge/rotr-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 12 Guests",
      events: "[INFERRED] 40 Guests",
      bhk: "[INFERRED] 4 BHK",
      villaArea: "[INFERRED] 5500 Sq.Ft Villa",
      lawn: "[INFERRED] Ridge Deck",
    },
    propertyDetails: [
      {
        label: "4 Scenic Bedrooms",
        icon: "Bed",
        description: "[INFERRED] Bedrooms with 180-degree hill views.",
      },
      {
        label: "4 Luxury Baths",
        icon: "Bath",
        description:
          "[INFERRED] Open-to-sky shower experiences in select baths.",
      },
      {
        label: "Infinity Pool",
        icon: "Droplets",
        description: "[INFERRED] Large heated pool on the edge of the ridge.",
      },
      {
        label: "Glass Living Area",
        icon: "Home",
        description: "[INFERRED] Unobstructed views from the central lounge.",
      },
      {
        label: "Sunset Deck",
        icon: "Sun",
        description:
          "[INFERRED] Dedicated outdoor area for evening relaxation.",
      },
      {
        label: "Private Chef",
        icon: "ChefHat",
        description: "[INFERRED] Gourmet culinary services available on-site.",
      },
      {
        label: "Stargazing Lounge",
        icon: "Moon",
        description:
          "[INFERRED] Telescope and comfortable seating for night skies.",
      },
      {
        label: "Smart Home Features",
        icon: "Sparkles",
        description: "[INFERRED] Automated climate and lighting controls.",
      },
    ],
    amenities: [
      {
        label: "Heated Infinity Pool",
        description: "[INFERRED] Swim while overlooking the valley.",
        icon: "Droplets",
      },
      {
        label: "Outdoor Barbecue",
        description: "[INFERRED] Premium grilling station on the deck.",
        icon: "Utensils",
      },
      {
        label: "Home Theatre",
        description:
          "[INFERRED] High-fidelity sound and large projection screen.",
        icon: "Tv",
      },
      {
        label: "High-Speed Wi-Fi",
        description: "[INFERRED] Seamless streaming and connectivity.",
        icon: "Wifi",
      },
      {
        label: "Yoga Pavilion",
        description: "[INFERRED] Serene space for morning wellness routines.",
        icon: "Heart",
      },
      {
        label: "Firepit Seating",
        description: "[INFERRED] Cozy evenings around the crackling fire.",
        icon: "Flame",
      },
      {
        label: "Air Conditioning",
        description: "[INFERRED] Fully temperature-controlled interiors.",
        icon: "Thermometer",
      },
      {
        label: "Daily Housekeeping",
        description: "[INFERRED] Impeccable cleanliness maintained by staff.",
        icon: "Sparkles",
      },
    ],
    services: [
      {
        title: "Curated Dining",
        description:
          "[INFERRED] Multi-course meals prepared by our gourmet chef.",
        icon: "ChefHat",
        footer: "[INFERRED] Ala-carte or package options.",
      },
      {
        title: "Sunset High Tea",
        description: "[INFERRED] Exclusive high tea setup on the ridge deck.",
        icon: "Coffee",
        footer: "[INFERRED] Served daily at 5 PM.",
      },
      {
        title: "Wellness Sessions",
        description:
          "[INFERRED] Guided yoga and meditation overlooking the hills.",
        icon: "Heart",
        footer: "[INFERRED] Requires advance booking.",
      },
      {
        title: "Trekking Guide",
        description: "[INFERRED] Local experts for morning nature trails.",
        icon: "Map",
        footer: "[INFERRED] Gear can be provided.",
      },
    ],
    categories: ["Villas", "Luxury Stays"],
    perfectFor: [
      "Exclusive Retreats",
      "Anniversary Celebrations",
      "Intimate Gatherings",
      "Wellness Getaways",
    ],
    activities: [
      {
        title: "[INFERRED] Infinity Swimming",
        image: "/images/activities/infinity-pool.jpg",
      },
      {
        title: "[INFERRED] Sunset Barbecue",
        image: "/images/activities/barbecue.jpg",
      },
      {
        title: "[INFERRED] Guided Trekking",
        image: "/images/activities/trekking.jpg",
      },
      {
        title: "[INFERRED] Stargazing",
        image: "/images/activities/stargaze.jpg",
      },
    ],
    spaces: [
      { name: "[INFERRED] Ridge Deck", image: "/images/spaces/rotr-deck.jpg" },
      {
        name: "[INFERRED] Sky Living Room",
        image: "/images/spaces/rotr-living.jpg",
      },
      {
        name: "[INFERRED] Master Bedroom",
        image: "/images/spaces/rotr-master.jpg",
      },
      {
        name: "[INFERRED] Yoga Pavilion",
        image: "/images/spaces/rotr-yoga.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Hilltop Villa Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹65,000 + taxes",
          },
        ],
        features: [
          "Exclusive villa access",
          "Chef & housekeeping",
          "Breakfast included",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/retreat-on-the-ridge.jpg",
      address: "[INFERRED] Hilltop Estates, Nandi Hills, Bangalore",
      distance: "[INFERRED] 60 mins from CBD",
      nearby: [{ label: "AIRPORT", distance: "45 mins" }],
    },
    video: "/images/retreats/retreat-on-the-ridge/video.jpg",
    faq: [
      {
        question: "Is the infinity pool heated?",
        answer:
          "[INFERRED] Yes, the infinity pool is temperature-controlled for comfort, allowing for year-round swimming.",
      },
      {
        question: "Can we host a loud party on the deck?",
        answer:
          "[INFERRED] As a serene hilltop sanctuary, loud outdoor music is restricted post 10 PM. We encourage intimate, relaxed gatherings rather than large parties.",
      },
      {
        question: "Is the retreat safe for young children?",
        answer:
          "[INFERRED] While children are welcome, the cliffside nature of the property and infinity pool require adult supervision at all times.",
      },
      {
        question: "How do we arrange meals?",
        answer:
          "[INFERRED] You can opt for our curated meal packages prepared by the in-house chef, or order a-la-carte menu items during your stay.",
      },
      {
        question: "Are pets allowed at Retreat on the Ridge?",
        answer:
          "[INFERRED] Unfortunately, to maintain the pristine environment and due to the hilltop location, pets are restricted at this property.",
      },
      {
        question: "Is Wi-Fi reliable on the hill?",
        answer:
          "[INFERRED] Yes, we have a dedicated high-speed broadband connection with backup routers to ensure seamless connectivity.",
      },
      {
        question: "What is the road condition leading up to the villa?",
        answer:
          "[INFERRED] The approach road is fully paved and accessible by all standard vehicles, though it involves a scenic uphill drive.",
      },
    ],
  },
  {
    id: "royalty",
    name: "Royalty",
    type: "PALATIAL ESTATE RETREAT",
    location: "[INFERRED] Devanahalli, Bangalore",
    shortDescription:
      "[INFERRED] An extraordinary palatial estate designed for majestic celebrations and ultra-luxurious stays, featuring lush gardens and regal interiors.",
    description:
      "[INFERRED] Step into a world of grandeur at Royalty. This opulent estate offers a unique blend of classic palatial architecture and modern luxury. With its sweeping staircases, crystal chandeliers, expansive royal suites, and meticulously manicured grounds, Royalty is the ultimate destination for grand weddings, exclusive corporate retreats, and unforgettable family reunions.",
    thumbnail: "/images/retreats/royalty/royalty-thumb.jpg",
    image: "/images/retreats/royalty/royalty-thumb.jpg",
    images: [
      "/images/retreats/royalty/royalty-1.jpg",
      "/images/retreats/royalty/royalty-2.jpg",
      "/images/retreats/royalty/royalty-3.jpg",
      "/images/retreats/royalty/royalty-4.jpg",
      "/images/retreats/royalty/royalty-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 16 Guests",
      events: "[INFERRED] 200 Guests",
      bhk: "[INFERRED] 6 Royal Suites",
      villaArea: "[INFERRED] 12000 Sq.Ft Estate",
      lawn: "[INFERRED] 1 Acre Imperial Garden",
    },
    propertyDetails: [
      {
        label: "6 Royal Suites",
        icon: "Bed",
        description:
          "[INFERRED] Oversized suites with four-poster beds and lounging areas.",
      },
      {
        label: "6 Marble Baths",
        icon: "Bath",
        description:
          "[INFERRED] Luxurious en-suite bathrooms featuring deep soaking tubs.",
      },
      {
        label: "Grand Ballroom",
        icon: "Music",
        description:
          "[INFERRED] Double-height ceiling hall perfect for gala dinners.",
      },
      {
        label: "Imperial Garden",
        icon: "TreePine",
        description:
          "[INFERRED] Sprawling lawns ideal for large-scale outdoor events.",
      },
      {
        label: "Private Cinema",
        icon: "Tv",
        description: "[INFERRED] Plush 15-seater screening room.",
      },
      {
        label: "Banquet Dining",
        icon: "Utensils",
        description: "[INFERRED] Formal dining room seating up to 24 guests.",
      },
      {
        label: "Executive Lounge",
        icon: "Briefcase",
        description: "[INFERRED] Quiet workspace and meeting area.",
      },
      {
        label: "Fountain Courtyard",
        icon: "Droplets",
        description:
          "[INFERRED] A stunning central courtyard with water features.",
      },
    ],
    amenities: [
      {
        label: "Swimming Pool",
        description: "[INFERRED] Large outdoor pool flanked by cabanas.",
        icon: "Droplets",
      },
      {
        label: "Butler Service",
        description: "[INFERRED] Dedicated staff available 24/7.",
        icon: "Users",
      },
      {
        label: "High-Speed Wi-Fi",
        description: "[INFERRED] Estate-wide seamless connectivity.",
        icon: "Wifi",
      },
      {
        label: "Central Air Conditioning",
        description: "[INFERRED] Climate-controlled comfort throughout.",
        icon: "Thermometer",
      },
      {
        label: "Valet Parking",
        description: "[INFERRED] Ample parking space with valet assistance.",
        icon: "Car",
      },
      {
        label: "Spa Room",
        description: "[INFERRED] In-house massage and therapy room.",
        icon: "Heart",
      },
      {
        label: "Billiard Room",
        description: "[INFERRED] Elegant game room with a vintage pool table.",
        icon: "Gamepad",
      },
      {
        label: "Helipad",
        description: "[INFERRED] Private landing spot for VIP arrivals.",
        icon: "Crosshair",
      },
    ],
    services: [
      {
        title: "Event Planning",
        description: "[INFERRED] End-to-end management for weddings and galas.",
        icon: "Calendar",
        footer: "[INFERRED] Bespoke event packages available.",
      },
      {
        title: "Gourmet Catering",
        description: "[INFERRED] Custom menus designed by executive chefs.",
        icon: "ChefHat",
        footer: "[INFERRED] Covers up to 200 event guests.",
      },
      {
        title: "Chauffeur Services",
        description: "[INFERRED] Luxury fleet available for local transport.",
        icon: "Car",
        footer: "[INFERRED] On-call luxury vehicles.",
      },
      {
        title: "Live Entertainment",
        description:
          "[INFERRED] Arrangement of bands, DJs, or classical musicians.",
        icon: "Music",
        footer: "[INFERRED] Subject to availability.",
      },
    ],
    categories: ["Villas", "Event Spaces"],
    perfectFor: [
      "Grand Weddings",
      "Corporate Galas",
      "VIP Retreats",
      "Large Family Reunions",
    ],
    activities: [
      {
        title: "[INFERRED] Royal Banquet",
        image: "/images/activities/banquet.jpg",
      },
      {
        title: "[INFERRED] Poolside Soiree",
        image: "/images/activities/pool-party.jpg",
      },
      {
        title: "[INFERRED] Garden High Tea",
        image: "/images/activities/high-tea.jpg",
      },
      {
        title: "[INFERRED] Billiards & Cigars",
        image: "/images/activities/billiards.jpg",
      },
    ],
    spaces: [
      {
        name: "[INFERRED] Grand Ballroom",
        image: "/images/spaces/royalty-ballroom.jpg",
      },
      {
        name: "[INFERRED] Imperial Garden",
        image: "/images/spaces/royalty-garden.jpg",
      },
      {
        name: "[INFERRED] Royal Master Suite",
        image: "/images/spaces/royalty-master.jpg",
      },
      {
        name: "[INFERRED] Fountain Courtyard",
        image: "/images/spaces/royalty-courtyard.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Palatial Estate Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹1,20,000 + taxes",
          },
        ],
        features: [
          "Exclusive estate access",
          "Butler & Chef service",
          "Breakfast & Hi-Tea included",
        ],
      },
      events: {
        title: "Grand Celebration Venue",
        subtitle: "8 hour event block",
        packages: [
          {
            label: "Venue Fee Starting From",
            price: "[INFERRED] ₹3,50,000 + taxes",
          },
        ],
        features: [
          "Access to Imperial lawns & Ballroom",
          "Valet and security services",
          "Bridal suite access",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/royalty.jpg",
      address: "[INFERRED] Devanahalli main road, Bangalore",
      distance: "[INFERRED] 45 mins from CBD",
      nearby: [{ label: "AIRPORT", distance: "15 mins" }],
    },
    video: "/images/retreats/royalty/video.jpg",
    faq: [
      {
        question: "What is the maximum capacity for events?",
        answer:
          "[INFERRED] The Imperial Garden can comfortably host up to 200 guests for outdoor events, while the Grand Ballroom accommodates up to 80 guests indoors.",
      },
      {
        question: "Can we hire outside caterers for our wedding?",
        answer:
          "[INFERRED] We have an exclusive panel of premium caterers. Outside caterers are permitted only under specific conditions and with prior management approval.",
      },
      {
        question: "Is there sufficient parking for large events?",
        answer:
          "[INFERRED] Yes, the estate features ample parking space for up to 60 vehicles, and we provide complimentary valet service for events.",
      },
      {
        question: "Are the swimming pool and spa open 24/7?",
        answer:
          "[INFERRED] The pool is accessible 24/7 for residing guests. Spa treatments must be booked in advance and operate between 8 AM and 8 PM.",
      },
      {
        question: "Is the estate wheelchair accessible?",
        answer:
          "[INFERRED] Yes, the ground floor including the ballroom, dining areas, and two royal suites are fully wheelchair accessible.",
      },
      {
        question: "Do you provide decor services?",
        answer:
          "[INFERRED] We offer comprehensive event planning which includes elite decor services tailored to the grandeur of the venue.",
      },
      {
        question: "Is loud music permitted outdoors?",
        answer:
          "[INFERRED] Outdoor music is permitted up to 10 PM in accordance with local regulations, after which the event can move into the sound-proofed Grand Ballroom.",
      },
    ],
  },
  {
    id: "tranquil",
    name: "Tranquil",
    type: "NATURE VILLA RETREAT",
    location: "[INFERRED] Outskirts, Bangalore",
    shortDescription:
      "[INFERRED] Escape to a serene natural oasis with lush greenery, providing the perfect sanctuary for relaxation and rejuvenation.",
    description:
      "[INFERRED] Tranquil is a breathtaking nature retreat designed to seamlessly blend luxury with the environment. Surrounded by verdant landscapes and whispering trees, this villa offers a peaceful haven away from the city's hustle. Perfect for intimate family getaways, wellness retreats, or simply unwinding in the lap of nature.",
    thumbnail: "/images/retreats/tranquil/tranquil-thumb.jpg",
    image: "/images/retreats/tranquil/tranquil-thumb.jpg",
    images: [
      "/images/retreats/tranquil/tranquil-1.jpg",
      "/images/retreats/tranquil/tranquil-2.jpg",
      "/images/retreats/tranquil/tranquil-3.jpg",
      "/images/retreats/tranquil/tranquil-4.jpg",
      "/images/retreats/tranquil/tranquil-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 8 Guests",
      events: "[INFERRED] 30 Guests",
      bhk: "[INFERRED] 3 Nature Suites",
      villaArea: "[INFERRED] 4500 Sq.Ft Villa",
      lawn: "[INFERRED] 12000 Sq.Ft Zen Garden",
    },
    propertyDetails: [
      {
        label: "3 Nature Suites",
        icon: "Bed",
        description: "[INFERRED] Cozy bedrooms with forest views.",
      },
      {
        label: "3 Ensuite Baths",
        icon: "Bath",
        description: "[INFERRED] Modern bathrooms with organic amenities.",
      },
      {
        label: "Zen Garden",
        icon: "TreePine",
        description: "[INFERRED] Manicured quiet lawns for meditation.",
      },
      {
        label: "Yoga Deck",
        icon: "Sun",
        description: "[INFERRED] Open-air wooden deck surrounded by trees.",
      },
      {
        label: "Infinity Pool",
        icon: "Droplets",
        description: "[INFERRED] Temperature-controlled nature pool.",
      },
      {
        label: "Organic Dining Area",
        icon: "Utensils",
        description: "[INFERRED] Farm-to-table dining space.",
      },
      {
        label: "Library Lounge",
        icon: "BookOpen",
        description: "[INFERRED] Quiet reading room with forest views.",
      },
      {
        label: "Firepit Seating",
        icon: "Flame",
        description: "[INFERRED] Cozy evening gathering spot.",
      },
    ],
    amenities: [
      {
        label: "Infinity Pool",
        description: "[INFERRED] Stunning pool blending with nature.",
        icon: "Droplets",
      },
      {
        label: "Chef on Call",
        description: "[INFERRED] Personalized organic meals prepared fresh.",
        icon: "ChefHat",
      },
      {
        label: "Fast Wi-Fi",
        description: "[INFERRED] Provided via satellite, subject to weather.",
        icon: "Wifi",
      },
      {
        label: "Air Conditioning",
        description: "[INFERRED] Comfort in all indoor spaces.",
        icon: "Thermometer",
      },
      {
        label: "Ample Parking",
        description: "[INFERRED] Secure parking for up to 4 cars.",
        icon: "Car",
      },
      {
        label: "Wellness Massages",
        description: "[INFERRED] In-villa spa treatments on request.",
        icon: "Heart",
      },
      {
        label: "Bicycles",
        description: "[INFERRED] Complimentary bikes for nature trails.",
        icon: "Bike",
      },
      {
        label: "24/7 Security",
        description: "[INFERRED] Round-the-clock estate safety.",
        icon: "Shield",
      },
    ],
    services: [
      {
        title: "Wellness Programs",
        description: "[INFERRED] Guided yoga and meditation sessions.",
        icon: "Leaf",
        footer: "[INFERRED] Pre-booking required.",
      },
      {
        title: "Farm-to-Table Dining",
        description:
          "[INFERRED] Meals crafted from locally sourced organic produce.",
        icon: "Utensils",
        footer: "[INFERRED] Dietary preferences accommodated.",
      },
      {
        title: "Nature Trails",
        description: "[INFERRED] Guided walks exploring local flora and fauna.",
        icon: "Map",
        footer: "[INFERRED] Complimentary for residing guests.",
      },
      {
        title: "Intimate Gatherings",
        description: "[INFERRED] Perfect setup for small, quiet celebrations.",
        icon: "GlassWater",
        footer: "[INFERRED] Max 30 guests.",
      },
    ],
    categories: ["Villas", "Nature Retreats"],
    perfectFor: [
      "Wellness Retreats",
      "Family Getaways",
      "Couples Staycation",
      "Intimate Gatherings",
    ],
    activities: [
      {
        title: "[INFERRED] Yoga Session",
        image: "/images/activities/yoga.jpg",
      },
      {
        title: "[INFERRED] Nature Walk",
        image: "/images/activities/nature-walk.jpg",
      },
      {
        title: "[INFERRED] Organic Dining",
        image: "/images/activities/organic-dining.jpg",
      },
      {
        title: "[INFERRED] Poolside Relaxation",
        image: "/images/activities/pool-relax.jpg",
      },
    ],
    spaces: [
      {
        name: "[INFERRED] Zen Garden",
        image: "/images/spaces/tranquil-garden.jpg",
      },
      {
        name: "[INFERRED] Yoga Deck",
        image: "/images/spaces/tranquil-deck.jpg",
      },
      {
        name: "[INFERRED] Nature Suite",
        image: "/images/spaces/tranquil-suite.jpg",
      },
      {
        name: "[INFERRED] Infinity Pool",
        image: "/images/spaces/tranquil-pool.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Tranquil Nature Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹35,000 + taxes",
          },
        ],
        features: [
          "Exclusive villa access",
          "Chef service on call",
          "Complimentary breakfast",
        ],
      },
      events: {
        title: "Intimate Gatherings",
        subtitle: "8 hour event block",
        packages: [
          {
            label: "Venue Fee Starting From",
            price: "[INFERRED] ₹65,000 + taxes",
          },
        ],
        features: [
          "Access to Zen Garden & Deck",
          "Valet and security services",
          "Basic decor arrangement",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/tranquil.jpg",
      address: "[INFERRED] Outskirts, Bangalore",
      distance: "[INFERRED] 60 mins from CBD",
      nearby: [{ label: "NATURE RESERVE", distance: "10 mins" }],
    },
    video: "/images/retreats/tranquil/video.jpg",
    faq: [
      {
        question: "What is the maximum capacity for a stay?",
        answer:
          "[INFERRED] The villa comfortably sleeps up to 8 guests across 3 nature suites.",
      },
      {
        question: "Is the pool heated?",
        answer:
          "[INFERRED] Yes, the infinity pool is temperature-controlled for your comfort year-round.",
      },
      {
        question: "Do you allow pets?",
        answer:
          "[INFERRED] Tranquil is a pet-friendly property, though prior intimation is required.",
      },
      {
        question: "Are meals included?",
        answer:
          "[INFERRED] Breakfast is included. Lunch and dinner can be prepared by our chef on a la carte basis using organic ingredients.",
      },
      {
        question: "Is there Wi-Fi?",
        answer:
          "[INFERRED] Yes, we provide high-speed satellite Wi-Fi, though speeds may occasionally vary due to the natural surroundings.",
      },
      {
        question: "Can we host a party with loud music?",
        answer:
          "[INFERRED] Tranquil is a quiet zone focused on wellness. Loud music and large parties are strictly prohibited.",
      },
      {
        question: "Are wellness sessions included in the stay?",
        answer:
          "[INFERRED] Scheduled morning yoga is complimentary. Specialized wellness programs and massages require prior booking and carry additional charges.",
      },
    ],
  },
  {
    id: "wonderland",
    name: "Wonderland",
    type: "FAMILY & KIDS THEMED RETREAT",
    location: "[INFERRED] Outskirts, Bangalore",
    shortDescription:
      "[INFERRED] A magical escape designed for families, featuring whimsical themes, expansive play areas, and luxury comfort for all ages.",
    description:
      "[INFERRED] Step into a world of imagination at Wonderland. This uniquely designed retreat is built to enchant children and relax adults. With themed bedrooms, an exclusive kids' splash pool, outdoor adventure zones, and premium amenities for parents, Wonderland offers the ultimate family staycation experience.",
    thumbnail: "/images/retreats/wonderland/wonderland-thumb.jpg",
    image: "/images/retreats/wonderland/wonderland-thumb.jpg",
    images: [
      "/images/retreats/wonderland/wonderland-1.jpg",
      "/images/retreats/wonderland/wonderland-2.jpg",
      "/images/retreats/wonderland/wonderland-3.jpg",
      "/images/retreats/wonderland/wonderland-4.jpg",
      "/images/retreats/wonderland/wonderland-5.jpg",
    ],
    stats: {
      stay: "[INFERRED] 12 Guests",
      events: "[INFERRED] 40 Guests",
      bhk: "[INFERRED] 4 Themed Suites",
      villaArea: "[INFERRED] 5500 Sq.Ft Villa",
      lawn: "[INFERRED] 15000 Sq.Ft Play Lawn",
    },
    propertyDetails: [
      {
        label: "4 Themed Suites",
        icon: "Bed",
        description:
          "[INFERRED] Whimsical decor for kids and luxury for adults.",
      },
      {
        label: "4 Ensuite Baths",
        icon: "Bath",
        description: "[INFERRED] Child-friendly and premium adult bathrooms.",
      },
      {
        label: "Adventure Lawn",
        icon: "TreePine",
        description: "[INFERRED] Expansive outdoor play area.",
      },
      {
        label: "Game Room",
        icon: "Gamepad2",
        description: "[INFERRED] Indoor arcade, board games, and consoles.",
      },
      {
        label: "Family Pool",
        icon: "Droplets",
        description:
          "[INFERRED] Main pool featuring a shallow kids' splash zone.",
      },
      {
        label: "Al Fresco Dining",
        icon: "Utensils",
        description: "[INFERRED] Outdoor seating for family barbecues.",
      },
      {
        label: "Mini Theatre",
        icon: "MonitorPlay",
        description: "[INFERRED] Cozy screening room for family movie nights.",
      },
      {
        label: "Treehouse",
        icon: "Tent",
        description: "[INFERRED] Safe and magical kids' treehouse in the lawn.",
      },
    ],
    amenities: [
      {
        label: "Family Pool & Splash Zone",
        description: "[INFERRED] Temperature-controlled, safe depths.",
        icon: "Droplets",
      },
      {
        label: "Kids' Menu",
        description: "[INFERRED] Special chef-curated meals for children.",
        icon: "ChefHat",
      },
      {
        label: "High-Speed Wi-Fi",
        description: "[INFERRED] Streaming and gaming ready.",
        icon: "Wifi",
      },
      {
        label: "Climate Control",
        description: "[INFERRED] AC and heating in all rooms.",
        icon: "Thermometer",
      },
      {
        label: "Parking",
        description: "[INFERRED] Secure parking for up to 5 cars.",
        icon: "Car",
      },
      {
        label: "Smart TVs",
        description: "[INFERRED] Netflix and Disney+ enabled.",
        icon: "MonitorPlay",
      },
      {
        label: "Nanny Quarters",
        description: "[INFERRED] Dedicated resting space for support staff.",
        icon: "Home",
      },
      {
        label: "Security",
        description: "[INFERRED] 24/7 CCTV and gated access.",
        icon: "Shield",
      },
    ],
    services: [
      {
        title: "Curated Kids' Activities",
        description: "[INFERRED] Supervised games, arts, and crafts.",
        icon: "Palette",
        footer: "[INFERRED] Weekend schedule available.",
      },
      {
        title: "Family Barbecue",
        description: "[INFERRED] Live grill experiences sorted by our chef.",
        icon: "Flame",
        footer: "[INFERRED] Additional charges apply.",
      },
      {
        title: "Movie Nights",
        description: "[INFERRED] Popcorn and private screenings.",
        icon: "Ticket",
        footer: "[INFERRED] Complimentary setup.",
      },
      {
        title: "Kids' Birthday Parties",
        description: "[INFERRED] Full event planning and decor.",
        icon: "PartyPopper",
        footer: "[INFERRED] Starting at 40 guests.",
      },
    ],
    categories: ["Villas", "Themed Retreats", "Family & Kids"],
    perfectFor: [
      "Family Vacations",
      "Kids' Birthdays",
      "Weekend Escapes",
      "Multi-Gen Getaways",
    ],
    activities: [
      {
        title: "[INFERRED] Treasure Hunt",
        image: "/images/activities/treasure-hunt.jpg",
      },
      {
        title: "[INFERRED] Pool Games",
        image: "/images/activities/pool-games.jpg",
      },
      {
        title: "[INFERRED] Outdoor Cinema",
        image: "/images/activities/outdoor-cinema.jpg",
      },
      {
        title: "[INFERRED] Board Game Night",
        image: "/images/activities/board-games.jpg",
      },
    ],
    spaces: [
      {
        name: "[INFERRED] Play Lawn",
        image: "/images/spaces/wonderland-lawn.jpg",
      },
      {
        name: "[INFERRED] Treehouse",
        image: "/images/spaces/wonderland-treehouse.jpg",
      },
      {
        name: "[INFERRED] Themed Bedroom",
        image: "/images/spaces/wonderland-bed.jpg",
      },
      {
        name: "[INFERRED] Splash Pool",
        image: "/images/spaces/wonderland-pool.jpg",
      },
    ],
    pricing: {
      stay: {
        title: "Wonderland Family Stay",
        subtitle: "22 hours (1 PM check-in · 11 AM checkout)",
        packages: [
          {
            label: "Starting From",
            price: "[INFERRED] ₹40,000 + taxes",
          },
        ],
        features: [
          "Exclusive access to villa and play zones",
          "Chef service for customized meals",
          "Complimentary kids' welcome kit",
        ],
      },
      events: {
        title: "Magical Celebrations",
        subtitle: "8 hour event block",
        packages: [
          {
            label: "Venue Fee Starting From",
            price: "[INFERRED] ₹75,000 + taxes",
          },
        ],
        features: [
          "Access to lawns and living areas",
          "Valet parking",
          "Dedicated play supervisors available",
        ],
      },
    },
    locationDetails: {
      mapImage: "/images/map/wonderland.jpg",
      address: "[INFERRED] Outskirts, Bangalore",
      distance: "[INFERRED] 45 mins from Airport",
      nearby: [{ label: "AMUSEMENT PARK", distance: "15 mins" }],
    },
    video: "/images/retreats/wonderland/video.jpg",
    faq: [
      {
        question: "Is the villa safe for toddlers?",
        answer:
          "[INFERRED] Yes, the property is designed with child safety in mind, including pool fences and carpeted indoor play areas on request.",
      },
      {
        question: "Can we host a child's birthday party here?",
        answer:
          "[INFERRED] Absolutely. Wonderland is perfect for kids' birthdays and we can help arrange decor, catering, and entertainment.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "[INFERRED] Yes, we are a pet-friendly retreat. We have ample open space for your furry family members.",
      },
      {
        question: "Does the chef cater to specific allergies?",
        answer:
          "[INFERRED] Yes, our culinary team is highly trained and can accommodate specific dietary needs and allergies, particularly for children.",
      },
      {
        question: "Is there accommodation for nannies/drivers?",
        answer:
          "[INFERRED] Yes, we have dedicated support staff quarters available on the premises.",
      },
      {
        question: "Is the pool temperature controlled?",
        answer:
          "[INFERRED] Yes, the entire family pool, including the splash zone, is temperature-controlled.",
      },
      {
        question: "What entertainment options are available?",
        answer:
          "[INFERRED] We offer a game room with consoles, Smart TVs with OTT subscriptions, outdoor play areas, and a mini-theatre setup.",
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
