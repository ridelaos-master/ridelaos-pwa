// 코스 영어 데이터 매핑 (DB PostgREST 캐시 우회용)
export const COURSE_EN_DATA: Record<string, { name_en: string; tagline_en: string; description_en: string; details_en: Record<string, unknown> }> = {
  '00000000-0000-0000-0000-000000000100': {
    name_en: 'Vientiane–Vang Vieng',
    tagline_en: 'Your first taste of Laos riding',
    description_en: 'The perfect starter route. Ride from Vientiane to Vang Vieng through rolling hills and riverside villages.',
    details_en: {
      highlights: [
        "Classic Vientiane to Vang Vieng run — the most popular route in Laos",
        "Scenic Route 13 through limestone karst hills and river valleys",
        "Arrive in Vang Vieng — Laos' adventure capital",
        "Perfect introduction to Laos road conditions and culture",
        "Small group, experienced guide, full support vehicle"
      ],
      itinerary: [
        { day: 1, title: "Vientiane → Vang Vieng", distance_km: 156, description: "Depart Vientiane early. Ride north through Hinheup and Kasi. Arrive Vang Vieng for overnight.", tips: "Great warm-up day. Roads are well-paved. Enjoy the karst scenery." }
      ],
      requirements: [
        "Valid motorcycle license",
        "Basic riding experience recommended",
        "Suitable for newer riders with some experience"
      ],
      recommended_for: [
        "First-time Laos riders",
        "Riders wanting a short, scenic introduction",
        "Those combining riding with Vang Vieng activities"
      ],
      packing_tips: [
        "Light daypack — support vehicle carries luggage",
        "Rain jacket",
        "Sunscreen and sunglasses",
        "Camera for karst scenery"
      ],
      photo_points: [
        "Kasi valley viewpoint",
        "Nam Song River bridge near Vang Vieng",
        "Karst mountain backdrop at sunset"
      ],
      meeting_point: "Vientiane — Ride Laos HQ, 07:30",
      insurance_notice: "Basic travel insurance required. Comprehensive coverage recommended."
    }
  },
  '00000000-0000-0000-0000-000000000101': {
    name_en: 'Vang Vieng Adventure',
    tagline_en: 'Where the tarmac ends, the real Laos begins',
    description_en: 'Off-road trails and jungle tracks around Vang Vieng. Deep karst landscapes and remote villages.',
    details_en: {
      highlights: [
        "Off-road trails through Vang Vieng's stunning karst landscape",
        "Jungle tracks and river crossings rarely seen by tourists",
        "Remote hill tribe villages along the route",
        "Technical off-road sections for experienced riders",
        "Breathtaking views from highland dirt tracks"
      ],
      itinerary: [
        { day: 1, title: "Vang Vieng Off-Road Loop — Day 1", distance_km: 140, description: "Head east into the karst backcountry. River crossings, jungle trails, remote village lunch stop.", tips: "Tire pressure down to 25psi for off-road sections." },
        { day: 2, title: "Highland Trails — Day 2", distance_km: 140, description: "Continue through highland tracks. Panoramic views. Return to Vang Vieng.", tips: "Bring more water than you think you need." }
      ],
      requirements: [
        "Valid motorcycle license",
        "Off-road riding experience required",
        "Good physical fitness",
        "Full-face helmet mandatory"
      ],
      recommended_for: [
        "Experienced off-road riders",
        "Adventure seekers wanting to go beyond tourist trails",
        "Riders with dual-sport or enduro experience"
      ],
      packing_tips: [
        "Knee and elbow protection strongly recommended",
        "Waterproof boots",
        "Dry bag for valuables",
        "Extra water (2L minimum)",
        "Electrolyte tablets"
      ],
      photo_points: [
        "Karst valley panorama from highland track",
        "River crossing action shots",
        "Remote village scenery",
        "Jungle trail through dense forest"
      ],
      meeting_point: "Vang Vieng — Ride Laos Base Camp, 07:00",
      insurance_notice: "Comprehensive insurance with off-road coverage mandatory. Medical evacuation cover strongly recommended."
    }
  },
  '00000000-0000-0000-0000-000000000102': {
    name_en: 'Luang Prabang Culture',
    tagline_en: 'Ancient temples, emerald waterfalls, timeless roads',
    description_en: 'A journey through UNESCO World Heritage landscapes. Sacred temples, Kuang Si Falls, and hill tribe communities.',
    details_en: {
      highlights: [
        "Ride to Luang Prabang — Laos' most beautiful UNESCO World Heritage city",
        "Visit Kuang Si Waterfalls — the most stunning falls in Southeast Asia",
        "Sacred Buddhist temples and alms-giving ceremony at dawn",
        "Hill tribe villages and traditional weaving communities",
        "Scenic mountain roads through northern Laos highlands"
      ],
      itinerary: [
        { day: 1, title: "Vientiane → Vang Vieng", distance_km: 156, description: "Depart Vientiane. Ride north through karst hills to Vang Vieng. Overnight.", tips: "Warm-up day. Enjoy the scenery." },
        { day: 2, title: "Vang Vieng → Luang Prabang", distance_km: 225, description: "The mountain road north. Winding highland passes. Arrive Luang Prabang. Free afternoon to explore.", tips: "This is the most scenic day. Take your time on the mountain passes." },
        { day: 3, title: "Luang Prabang Cultural Day", distance_km: 40, description: "Morning alms-giving ceremony. Kuang Si Waterfalls. Temples. Night market.", tips: "Wake up at 05:30 for the alms-giving ceremony — deeply moving experience." },
        { day: 4, title: "Luang Prabang → Vang Vieng", distance_km: 225, description: "Return south through the highlands. Overnight Vang Vieng.", tips: null }
      ],
      requirements: [
        "Valid motorcycle license",
        "Comfortable with mountain road riding",
        "Moderate fitness level"
      ],
      recommended_for: [
        "Culture and history enthusiasts",
        "Riders wanting to combine scenic roads with UNESCO heritage",
        "Those seeking a balance of riding and sightseeing"
      ],
      packing_tips: [
        "Respectful clothing for temple visits (shoulders and knees covered)",
        "Rain gear — highland weather can change quickly",
        "Camera — this route has incredible photo opportunities",
        "Small daypack for cultural day explorations"
      ],
      photo_points: [
        "Kuang Si Waterfalls turquoise pools",
        "Mountain pass viewpoints on Route 13N",
        "Luang Prabang's golden temples at sunrise",
        "Mekong River at dusk from Mount Phousi"
      ],
      meeting_point: "Vientiane — Ride Laos HQ, 07:30",
      insurance_notice: "Travel insurance with medical coverage required. Hospital facilities are limited in northern Laos."
    }
  },
  '00000000-0000-0000-0000-000000000103': {
    name_en: 'Vientiane Surrounds',
    tagline_en: 'Easy day rides from the capital',
    description_en: 'A relaxed day-and-a-half loop from Vientiane. Perfect for exploring the countryside without straying too far.',
    details_en: {
      highlights: [
        "Explore the countryside within easy reach of the capital",
        "Buddha Park (Xieng Khuan) — surreal riverside sculpture garden",
        "Local riverside villages and morning markets",
        "Relaxed pace — perfect for easing into Laos riding",
        "Short riding day with plenty of time to stop and explore"
      ],
      itinerary: [
        { day: 1, title: "Vientiane City Loop & Buddha Park", distance_km: 80, description: "Morning ride to Buddha Park along the Mekong. Afternoon loop through riverside villages. Return to Vientiane.", tips: "Buddha Park opens at 08:00. Arrive early to beat the heat." },
        { day: 2, title: "Nam Ngum Reservoir Loop", distance_km: 120, description: "Half-day ride north to Nam Ngum Reservoir. Scenic lake views. Return to Vientiane by afternoon.", tips: "Great option for a relaxed morning ride with a lakeside lunch stop." }
      ],
      requirements: [
        "Valid motorcycle license",
        "Suitable for beginners and returning riders",
        "No off-road experience needed"
      ],
      recommended_for: [
        "First-time riders in Laos",
        "Those with limited time wanting a taste of Laos",
        "Riders wanting a relaxed, low-pressure experience"
      ],
      packing_tips: [
        "Light clothing — it gets hot",
        "Sunscreen and hat for stops",
        "Camera for Buddha Park",
        "Small amount of local currency for market stops"
      ],
      photo_points: [
        "Buddha Park giant reclining Buddha",
        "Mekong riverside at sunset",
        "Nam Ngum Reservoir panorama"
      ],
      meeting_point: "Vientiane — Ride Laos HQ, 08:00",
      insurance_notice: "Basic travel insurance required."
    }
  },
  '00000000-0000-0000-0000-000000000104': {
    name_en: 'Thakhek Loop',
    tagline_en: 'Laos at its best — the legendary loop',
    description_en: 'The most iconic motorcycle route in Laos. Limestone caves, turquoise rivers, and remote highland roads.',
    details_en: {
      highlights: [
        "The most iconic motorcycle loop in Laos — a bucket-list ride",
        "Kong Lor Cave: 7.5km underground river by boat — unmissable",
        "Turquoise rivers, limestone karst towers, and remote jungle roads",
        "Remote highland villages untouched by mass tourism",
        "The perfect balance of tarmac and light off-road sections"
      ],
      itinerary: [
        { day: 1, title: "Thakhek → Mahaxai", distance_km: 80, description: "Depart Thakhek east into the karst. First cave stops. Overnight Mahaxai.", tips: "Start the loop clockwise for the best experience." },
        { day: 2, title: "Mahaxai → Kong Lor Village", distance_km: 110, description: "Ride deeper into the karst interior. Arrive Kong Lor village. Afternoon rest.", tips: "Book your Kong Lor Cave boat for early morning Day 3." },
        { day: 3, title: "Kong Lor Cave → Nahin", distance_km: 100, description: "Early morning Kong Lor Cave boat trip — the highlight of the entire loop. Continue to Nahin.", tips: "Enter the cave at 08:00 for the best light and fewest crowds." },
        { day: 4, title: "Nahin → Thakhek", distance_km: 120, description: "Final leg of the loop. Return to Thakhek. Completion celebration.", tips: "You've done the Thakhek Loop. One of the great motorcycle journeys in Asia." }
      ],
      requirements: [
        "Valid motorcycle license",
        "Comfortable with rural roads and some unsealed sections",
        "Moderate fitness — 4 consecutive riding days",
        "Self-sufficient mindset — fuel and facilities are limited"
      ],
      recommended_for: [
        "Riders who want Laos' most famous loop",
        "Cave and karst landscape enthusiasts",
        "Those seeking off-the-beaten-track adventure without extreme off-road"
      ],
      packing_tips: [
        "Cash only — no ATMs on the loop",
        "Extra fuel canister recommended",
        "Water purification tablets",
        "Torch/headlamp for cave visits",
        "Rain gear — afternoons can bring sudden showers"
      ],
      photo_points: [
        "Kong Lor Cave underground river by boat",
        "Karst tower reflections in turquoise rivers",
        "Remote jungle road through limestone formations",
        "Sunrise over the karst from Mahaxai"
      ],
      meeting_point: "Thakhek — Ride Laos Southern Base, 07:30",
      insurance_notice: "Comprehensive insurance with medical evacuation cover required. Nearest hospital is in Thakhek — plan accordingly."
    }
  },
  '00000000-0000-0000-0000-000000000105': {
    name_en: 'Bolaven Plateau',
    tagline_en: 'Coffee, waterfalls and cool highland air',
    description_en: 'Ride the southern highlands. Dramatic waterfalls, coffee plantations, and cool mountain roads.',
    details_en: {
      highlights: [
        "Ride the cool highland plateau of southern Laos — a welcome escape from the heat",
        "Tad Fane and Tad Yuang — among the most spectacular waterfalls in Southeast Asia",
        "Laos coffee country — stop at working plantations and taste world-class Arabica",
        "Ethnic minority villages with traditional cultures preserved",
        "Smooth highland roads with sweeping curves and cool air"
      ],
      itinerary: [
        { day: 1, title: "Pakse → Bolaven Plateau", distance_km: 100, description: "Climb from Pakse onto the plateau. Coffee plantation stop. Tad Fane viewpoint. Overnight Paksong.", tips: "The temperature drops significantly on the plateau. Bring a light jacket." },
        { day: 2, title: "Plateau Loop — Waterfalls & Villages", distance_km: 150, description: "Full loop of the plateau highlights. Tad Yuang falls, ethnic villages, coffee stops. Return Pakse.", tips: "Tad Yuang is best in the morning light. Start early." },
        { day: 3, title: "Pakse & Wat Phu Extension (optional)", distance_km: 120, description: "Optional extension to Champasak and Wat Phu Khmer ruins. Return Pakse.", tips: "Wat Phu is one of the most underrated ancient sites in Southeast Asia. Highly recommended." }
      ],
      requirements: [
        "Valid motorcycle license",
        "Comfortable with winding highland roads",
        "Basic fitness level"
      ],
      recommended_for: [
        "Coffee lovers and food enthusiasts",
        "Waterfall and nature photography fans",
        "Riders wanting scenic roads without extreme difficulty"
      ],
      packing_tips: [
        "Light jacket or fleece — plateau evenings are cool",
        "Rain gear — the plateau receives heavy rainfall",
        "Camera with wide-angle lens for waterfall shots",
        "Reusable coffee cup — support local plantation cafes"
      ],
      photo_points: [
        "Tad Fane twin waterfall from the viewpoint",
        "Tad Yuang falls framed by jungle",
        "Coffee plantation rows at dawn",
        "Ethnic village life and traditional weaving"
      ],
      meeting_point: "Pakse — Ride Laos Southern Base, 08:00",
      insurance_notice: "Travel insurance with medical coverage required."
    }
  },
  '00000000-0000-0000-0000-000000000106': {
    name_en: 'Laos End-to-End',
    tagline_en: 'The ultimate proof you rode Laos',
    description_en: 'The full length of Laos in 8 days. 1,200km from Vientiane to the Chinese border. Not for the faint-hearted.',
    details_en: {
      highlights: [
        "Ride the full length of Laos — 1,200km from Vientiane to the Chinese border",
        "Karst caves, underground rivers, highlands, waterfalls, and Khmer ruins — all in one epic journey",
        "Kong Lor Cave + Bolaven Plateau + Wat Phu UNESCO site in a single route",
        "Earn your Laos End-to-End completion certificate and badge",
        "8 days of the most rewarding riding of your life"
      ],
      itinerary: [
        { day: 1, title: "Vientiane → Vang Vieng", distance_km: 156, description: "The epic begins. Karst route warm-up. Overnight Vang Vieng.", tip: "Day 1 is the warm-up. Pace yourself — you have 8 days ahead." },
        { day: 2, title: "Vang Vieng → Thakhek (long day)", distance_km: 480, description: "The longest day. Highway south to Thakhek.", tip: "Start early. This is the big highway push." },
        { day: 3, title: "Thakhek Loop — Kong Lor Cave", distance_km: 130, description: "Enter the legendary Thakhek Loop. Kong Lor Cave highlight.", tip: "Book Kong Lor boat in advance during peak season." },
        { day: 4, title: "Loop Return", distance_km: 130, description: "Complete the Thakhek Loop back to town.", tip: null },
        { day: 5, title: "Thakhek → Savannakhet", distance_km: 130, description: "Mekong riverside riding south.", tip: null },
        { day: 6, title: "Savannakhet → Pakse", distance_km: 250, description: "Cross into the deep south. Pakse overnight.", tip: null },
        { day: 7, title: "Bolaven Plateau & Wat Phu", distance_km: 150, description: "The highlight day. Cool plateau roads, coffee, waterfalls, ancient Khmer ruins.", tip: "Wat Phu closes at 17:00. Plan accordingly." },
        { day: 8, title: "Pakse → Vientiane (flight back)", distance_km: 0, description: "Your ride ends. Fly back from Pakse. Certificate ceremony.", tip: null }
      ],
      requirements: [
        "Valid motorcycle license (A class or equivalent)",
        "Minimum 3 years riding experience",
        "Good physical fitness — 8 consecutive riding days",
        "Full-face helmet mandatory"
      ],
      recommended_for: [
        "Experienced riders seeking the ultimate Laos challenge",
        "Adventure motorcyclists with long-distance touring experience",
        "Riders wanting a completion certificate"
      ],
      packing_tips: [
        "Lightweight rain gear (essential)",
        "Dry bags for electronics",
        "Electrolyte tablets for long days",
        "Basic tool kit and tire repair kit",
        "Sunscreen SPF 50+"
      ],
      photo_points: [
        "Kong Lor Cave entrance at dawn",
        "Bolaven Plateau waterfall cascades",
        "Wat Phu ancient temple ruins at sunset",
        "Mekong riverside at Savannakhet",
        "Finish line photo at Vientiane end point"
      ],
      meeting_point: "Vientiane — Ride Laos HQ, 07:00 Day 1",
      insurance_notice: "Comprehensive travel insurance with medical evacuation coverage is mandatory for this route."
    }
  },
}
