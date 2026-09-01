export type ApproximateRange = {
  kind: "approximate";
  min: number;
  max: number;
};

export type ApproximateNumber = {
  kind: "approximate";
  value: number;
};

export type MeetingPoint = {
  key: "boat_pier_thon_13" | "con_toc_pier";
  role: "primary" | "alternate";
  name: string;
  publicMapsName?: string;
  mapsHref: string;
  mapsEmbedUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parking: {
    motorbike: true;
    car: true;
  };
};

export type V1TourContract = {
  key: "trai-nghiem-pha-tam-giang";
  format: {
    operator: "family_run";
    arrangement: "private_or_shared_flexible";
  };
  pricing: {
    currency: "VND";
    unit: "per_person";
    options: readonly [
      {
        key: "standard";
        amount: 350000;
      },
      {
        key: "special";
        amount: 500000;
        additions: readonly ["crab", "squid", "brown_fish_porridge"];
      },
    ];
    minimumGuests: 2;
    typicalGuestCount: ApproximateRange;
    childPricing: {
      state: "unresolved";
    };
  };
  durationHours: ApproximateRange;
  operatingWindow: {
    meetingHour: ApproximateRange;
    finishHour: ApproximateRange;
    variesBySeasonAndConditions: true;
  };
  referenceItinerary: {
    timing: "illustrative";
    flexible: true;
    stops: readonly {
      key: "meet" | "depart" | "observe_do_no" | "sup" | "sunset_bbq" | "finish";
      time: string;
    }[];
  };
  experiences: readonly {
    key: "boat_ride" | "observe_do_no" | "sup" | "seafood_bbq" | "sunset";
    state: "core" | "conditional";
  }[];
  inclusions: readonly {
    key:
      | "boat"
      | "life_jackets"
      | "local_host"
      | "do_no_equipment"
      | "sup_equipment"
      | "seafood_bbq"
      | "bottled_water"
      | "tissues";
  }[];
  meetingPoints: readonly MeetingPoint[];
  meetingPointSelection: "family_confirms_after_enquiry";
  guestTransport: "self_arranged_to_agreed_meeting_point";
  weatherPolicy: {
    trigger: "strong_rain_or_wind_makes_experience_unsuitable";
    actions: readonly ["cancel", "reschedule"];
    operatorCancellationOptions: readonly ["full_deposit_refund", "free_reschedule"];
  };
  bookingPolicy: {
    depositPercent: 30;
    changeOrCancelNoticeHours: 24;
    onTimeOptions: readonly ["deposit_refund", "change_date"];
    lateCancellation: "deposit_forfeited";
    noShow: "deposit_forfeited";
  };
  host: {
    publicName: "Chú Huyền";
    roles: readonly ["boat_owner", "fisherman"];
    lagoonExperienceYears: ApproximateNumber;
    familyRun: true;
    wifeParticipates: true;
    foodPreparedByFamily: true;
  };
  unresolved: readonly [
    "child_pricing",
    "sup_swimming_or_eligibility",
    "sup_age_limits",
    "child_minimum_age",
    "elderly_suitability",
    "pregnancy_suitability",
    "mobility_or_medical_suitability",
    "detailed_safety_promises",
    "other_exclusions",
  ];
};

export const V1_PUBLIC_CONTACT = {
  phoneDisplay: "0332 279 474",
  phoneHref: "tel:+84332279474",
  zaloPhone: "0332 279 474",
  zaloHref: "https://zalo.me/0332279474",
} as const;

export const V1_TOUR = {
  key: "trai-nghiem-pha-tam-giang",
  format: {
    operator: "family_run",
    arrangement: "private_or_shared_flexible",
  },
  pricing: {
    currency: "VND",
    unit: "per_person",
    options: [
      { key: "standard", amount: 350000 },
      {
        key: "special",
        amount: 500000,
        additions: ["crab", "squid", "brown_fish_porridge"],
      },
    ],
    minimumGuests: 2,
    typicalGuestCount: { kind: "approximate", min: 10, max: 12 },
    childPricing: { state: "unresolved" },
  },
  durationHours: { kind: "approximate", min: 3, max: 4 },
  operatingWindow: {
    meetingHour: { kind: "approximate", min: 15, max: 16 },
    finishHour: { kind: "approximate", min: 19, max: 20 },
    variesBySeasonAndConditions: true,
  },
  referenceItinerary: {
    timing: "illustrative",
    flexible: true,
    stops: [
      { key: "meet", time: "15:40" },
      { key: "depart", time: "16:00" },
      { key: "observe_do_no", time: "16:30" },
      { key: "sup", time: "17:00" },
      { key: "sunset_bbq", time: "17:50" },
      { key: "finish", time: "19:45" },
    ],
  },
  experiences: [
    { key: "boat_ride", state: "core" },
    { key: "observe_do_no", state: "core" },
    { key: "sup", state: "conditional" },
    { key: "seafood_bbq", state: "core" },
    { key: "sunset", state: "conditional" },
  ],
  inclusions: [
    { key: "boat" },
    { key: "life_jackets" },
    { key: "local_host" },
    { key: "do_no_equipment" },
    { key: "sup_equipment" },
    { key: "seafood_bbq" },
    { key: "bottled_water" },
    { key: "tissues" },
  ],
  meetingPoints: [
    {
      key: "boat_pier_thon_13",
      role: "primary",
      name: "Bến đò thôn 13, Phong Quảng, Huế",
      publicMapsName: "Tour Du Lịch Phá Tam Giang - Chú Huyền",
      mapsHref:
        "https://www.google.com/maps/place/Tour+Du+l%E1%BB%8Bch+Ph%C3%A1+Tam+Giang+-+Ch%C3%BA+Huy%E1%BB%81n/@16.6279712,107.5035184,17z/data=!4m10!1m2!2m1!1zdG91ciBkdSBs4buLY2ggcGjDoSB0YW0gZ2lhbmcgLSBjaMO6IGh1eeG7gW4!3m6!1s0x31410f0d57c95e1d:0x559dd7c2099bd6dd!8m2!3d16.6278753!4d107.5060075!15sCix0b3VyIGR1IGzhu4tjaCBwaMOhIHRhbSBnaWFuZyAtIGNow7ogaHV54buBbpIBDXRvdXJfb3BlcmF0b3LgAQA!16s%2Fg%2F11zf720lcw?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=16.6278753,107.5060075+(Tour+Du+L%E1%BB%8Bch+Ph%C3%A1+Tam+Giang+-+Ch%C3%BA+Huy%E1%BB%81n)&t=&z=15&ie=UTF8&iwloc=&output=embed&hl=vi",
      coordinates: { lat: 16.6278753, lng: 107.5060075 },
      parking: { motorbike: true, car: true },
    },
    {
      key: "con_toc_pier",
      role: "alternate",
      name: "Bến đò Cồn Tộc",
      mapsHref:
        "https://www.google.com/maps/search/B%E1%BA%BFn+%C4%91%C3%B2+C%E1%BB%93n+T%E1%BB%99c/@16.6026424,107.5098769,17z?entry=s&sa=X&ved=1t%3A199789",
      coordinates: { lat: 16.6026424, lng: 107.5098769 },
      parking: { motorbike: true, car: true },
    },
  ],
  meetingPointSelection: "family_confirms_after_enquiry",
  guestTransport: "self_arranged_to_agreed_meeting_point",
  weatherPolicy: {
    trigger: "strong_rain_or_wind_makes_experience_unsuitable",
    actions: ["cancel", "reschedule"],
    operatorCancellationOptions: ["full_deposit_refund", "free_reschedule"],
  },
  bookingPolicy: {
    depositPercent: 30,
    changeOrCancelNoticeHours: 24,
    onTimeOptions: ["deposit_refund", "change_date"],
    lateCancellation: "deposit_forfeited",
    noShow: "deposit_forfeited",
  },
  host: {
    publicName: "Chú Huyền",
    roles: ["boat_owner", "fisherman"],
    lagoonExperienceYears: { kind: "approximate", value: 30 },
    familyRun: true,
    wifeParticipates: true,
    foodPreparedByFamily: true,
  },
  unresolved: [
    "child_pricing",
    "sup_swimming_or_eligibility",
    "sup_age_limits",
    "child_minimum_age",
    "elderly_suitability",
    "pregnancy_suitability",
    "mobility_or_medical_suitability",
    "detailed_safety_promises",
    "other_exclusions",
  ],
} as const satisfies V1TourContract;

export const PRIMARY_MEETING_POINT = V1_TOUR.meetingPoints[0];
export const SECONDARY_MEETING_POINT = V1_TOUR.meetingPoints[1];
