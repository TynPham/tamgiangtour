/**
 * Static preview content layer for the Tam Giang Tour V1 landing page.
 * 
 * Boundary note:
 * - Approved facts: phone number, Maps place label & coordinates, base inclusions, booking enquiry semantics.
 * - Preview content: promotional itinerary timings, experience highlights copy, family story narrative, FAQs.
 * All data in this file is structured for straightforward replacement with typed canonical models later.
 */

export interface NavigationItem {
  label: string;
  href: string;
}

export interface QuickFact {
  label: string;
  value: string;
  subtext?: string;
  iconName: string;
}

export interface HighlightItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badgeText?: string;
}

export interface ItineraryStop {
  time: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface InclusionsData {
  included: Array<{
    title: string;
    description: string;
  }>;
  notIncluded: Array<{
    title: string;
    description: string;
  }>;
  practicalNotes: string[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  span?: string; // Tailwind grid span helper
}

export interface TrustPillar {
  title: string;
  description: string;
  iconName: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface LandingPageContent {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage: string;
  };
  navigation: {
    brandName: string;
    brandSubtitle: string;
    items: NavigationItem[];
    ctaLabel: string;
  };
  hero: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    zaloCtaText: string;
    heroImage: string;
    heroImageAlt: string;
  };
  quickFacts: QuickFact[];
  highlights: {
    heading: string;
    subheading: string;
    description: string;
    items: HighlightItem[];
  };
  itinerary: {
    heading: string;
    subheading: string;
    note: string;
    stops: ItineraryStop[];
  };
  inclusions: InclusionsData;
  familyStory: {
    heading: string;
    subheading: string;
    badge: string;
    paragraphs: string[];
    quote: string;
    quoteAuthor: string;
    imageSrc: string;
    imageAlt: string;
  };
  gallery: {
    heading: string;
    subheading: string;
    description: string;
    photos: GalleryPhoto[];
  };
  trust: {
    heading: string;
    subheading: string;
    pillars: TrustPillar[];
    mapsLinkText: string;
    mapsNote: string;
  };
  faq: {
    heading: string;
    subheading: string;
    items: FaqItem[];
  };
  contact: {
    heading: string;
    subheading: string;
    description: string;
    phoneDisplay: string;
    phoneHref: string;
    zaloLabel: string;
    zaloHref: string;
    mapsPlaceKey: string;
    mapsPlaceName: string;
    mapsAddress: string;
    mapsCoordinates?: {
      lat: number;
      lng: number;
    };
    mapsEmbedUrl: string;
    mapsHref: string;
    directionsTip: string;
  };
  footer: {
    brandName: string;
    brandTagline: string;
    phone: string;
    zalo: string;
    address: string;
    copyrightYear: number;
    quickLinks: NavigationItem[];
  };
}

export const LANDING_PAGE_CONTENT: LandingPageContent = {
  metadata: {
    title: "Trải nghiệm Đầm phá Tam Giang cùng Gia đình Ngư dân Bản địa | Tour Chú Huyền",
    description:
      "Khám phá Phá Tam Giang - đầm phá nước lợ lớn nhất Đông Nam Á cùng gia đình ngư dân bản địa. Đón hoàng hôn, chèo SUP, thả lưới cá và thưởng thức tiệc BBQ hải sản đầm phá.",
    keywords: [
      "tour phá tam giang",
      "trải nghiệm phá tam giang",
      "chèo sup tam giang",
      "hoàng hôn tam giang",
      "hải sản phá tam giang",
      "tour chú huyền tam giang",
      "du lịch huế bản địa",
    ],
    canonicalUrl: "https://tamgiangtour.vn/vi",
    ogImage: "/images/tamgiang/hero-sunset.jpg",
  },

  navigation: {
    brandName: "Phá Tam Giang",
    brandSubtitle: "Tour Gia đình Chú Huyền",
    items: [
      { label: "Trải nghiệm", href: "/vi#trai-nghiem" },
      { label: "Lịch trình", href: "/vi#lich-trinh" },
      { label: "Dịch vụ", href: "/vi#dich-vu" },
      { label: "Câu chuyện", href: "/vi#cau-chuyen" },
      { label: "Khoảnh khắc", href: "/vi#khoanh-khac" },
      { label: "Hỏi đáp", href: "/vi#faq" },
      { label: "Liên hệ & Bản đồ", href: "/vi/lien-he" },
    ],
    ctaLabel: "Gửi yêu cầu đặt tour",
  },

  hero: {
    badge: "Trải nghiệm bản địa chân thật",
    heading: "Khám phá Đầm phá Tam Giang cùng Ngư dân Bản địa",
    subheading: "Đón trọn vẻ đẹp hoàng hôn xứ Huế trên vùng đầm phá nước lợ lớn nhất Đông Nam Á",
    description:
      "Cùng gia đình ngư dân xuôi thuyền gỗ lướt trên mặt nước mênh mông, chèo SUP giữa ráng chiều đỏ rực, tự tay thả lưới cất rớ và thưởng thức bữa tiệc BBQ hải sản đầm phá nóng hổi ngay tại chòi.",
    primaryCtaText: "Gửi yêu cầu đặt trải nghiệm",
    secondaryCtaText: "Xem lịch trình chi tiết",
    zaloCtaText: "Tư vấn nhanh qua Zalo",
    heroImage: "/images/tamgiang/hero-sunset.jpg",
    heroImageAlt: "Hoàng hôn buông xuống trên đầm phá Tam Giang với thuyền gỗ truyền thống và giàn rớ cá",
  },

  quickFacts: [
    {
      label: "Thời lượng",
      value: "~3.5 – 4 giờ",
      subtext: "Trọn vẹn một buổi chiều ngắm hoàng hôn",
      iconName: "Clock",
    },
    {
      label: "Thời gian tập trung",
      value: "15:40 chiều",
      subtext: "Thời điểm ánh sáng đẹp nhất trong ngày",
      iconName: "Sun",
    },
    {
      label: "Điểm đón & bến thuyền",
      value: "Bến Chú Huyền",
      subtext: "Định vị chính xác trên Google Maps",
      iconName: "MapPin",
    },
    {
      label: "Quy mô trải nghiệm",
      value: "Gia đình & nhóm nhỏ",
      subtext: "Thuyền gỗ mộc mạc, không xô bồ",
      iconName: "Users",
    },
  ],

  highlights: {
    heading: "Những khoảnh khắc không thể bỏ lỡ",
    subheading: "Trải nghiệm đời sống sông nước dung dị và yên bình của xứ Huế",
    description:
      "Không ồn ào như những điểm du lịch đông đúc, Phá Tam Giang đón bạn bằng sự tĩnh lặng của mặt nước, làn gió trong lành và sự chân thành của người dân làng chài.",
    items: [
      {
        id: "sup-sunset",
        tag: "Hoàng hôn & Thể thao nước",
        title: "Chèo SUP thả trôi giữa ráng chiều Tam Giang",
        description:
          "Tự tay chèo ván SUP lướt nhẹ trên mặt đầm phẳng lặng như gương khi mặt trời từ từ lặn sau dãy núi. Cảm nhận sự thư thái và không gian bao la rộng mở.",
        imageSrc: "/images/tamgiang/sup-sunset.jpg",
        imageAlt: "Khách trải nghiệm chèo SUP trên đầm phá Tam Giang đón ánh hoàng hôn vàng cam",
        badgeText: "Điểm nhấn đặc biệt",
      },
      {
        id: "local-fishing",
        tag: "Đời sống làng chài",
        title: "Thử sức nghề chài lưới truyền thống cùng ngư dân",
        description:
          "Ngồi trên chiếc thuyền gỗ mộc mạc, lắng nghe chuyện nghề sông nước và được ngư dân hướng dẫn cách đổ nơm, cất rớ, kéo lưới bắt tôm cá đầm phá.",
        imageSrc: "/images/tamgiang/local-fishing.jpg",
        imageAlt: "Ngư dân bản địa Tam Giang hướng dẫn thao tác cất rớ cá truyền thống trên thuyền gỗ",
      },
      {
        id: "seafood-bbq",
        tag: "Ẩm thực đầm phá",
        title: "Thưởng thức BBQ hải sản đầm phá nóng hổi",
        description:
          "Bữa tiệc ấm cúng với tôm đất tươi nướng than, cá đầm nướng mỡ hành thơm phức, chấm muối ớt chanh chuẩn vị miền Trung ngay bên làn gió đầm phá mát rượi.",
        imageSrc: "/images/tamgiang/seafood-bbq.jpg",
        imageAlt: "Mâm hải sản nướng BBQ gồm tôm đất và cá đầm nướng trên lá chuối cạnh mép nước",
        badgeText: "Hương vị tươi ngon",
      },
    ],
  },

  itinerary: {
    heading: "Lịch trình trải nghiệm chi tiết",
    subheading: "Hành trình buổi chiều từ 15:40 đến 19:45 (Bản thảo dự kiến)",
    note: "Thời gian biểu có thể linh hoạt điều chỉnh nhẹ theo mùa và con nước thực tế để quý khách ngắm được hoàng hôn đẹp nhất.",
    stops: [
      {
        time: "15:40",
        title: "Tập trung tại bến thuyền Chú Huyền",
        description:
          "Gặp gỡ gia đình đón tiếp tại bến, trang bị áo phao đạt chuẩn và nghe hướng dẫn an toàn trước khi lên thuyền.",
        highlight: "Đón tiếp & chuẩn bị",
      },
      {
        time: "16:00",
        title: "Xuất bến du ngoạn đầm phá Tam Giang",
        description:
          "Thuyền gỗ rẽ sóng đưa bạn vào lòng đầm phá nước lợ mênh mông, ngắm nhìn khung cảnh làng chài yên bình và các giàn rớ cá trải dài.",
        highlight: "Du ngoạn sông nước",
      },
      {
        time: "16:30",
        title: "Trải nghiệm đánh bắt cá truyền thống",
        description:
          "Thử sức đổ nơm, kéo rớ và kéo lưới cùng ngư dân địa phương. Khám phá cách sinh kế mộc mạc gắn bó bao đời của cư dân đầm phá.",
        highlight: "Hoạt động tương tác",
      },
      {
        time: "17:00",
        title: "Chèo SUP tự do đón hoàng hôn rực rỡ",
        description:
          "Trang bị ván chèo SUP, thả trôi bồng bềnh trên vùng nước cạn an toàn, lưu lại những bức ảnh hoàng hôn tuyệt đẹp giữa không gian bao la.",
        highlight: "Khoảnh khắc hoàng hôn",
      },
      {
        time: "17:50",
        title: "Tiệc BBQ hải sản đầm phá tại chỗ",
        description:
          "Cập chòi đầm phá, quây quần thưởng thức các món hải sản đầm phá tươi nướng than hồng thơm lừng cùng nước giải khát mát lạnh.",
        highlight: "Ẩm thực bản địa",
      },
      {
        time: "19:45",
        title: "Thuyền đưa quý khách trở lại bến",
        description:
          "Thuyền cập bến Chú Huyền trong không khí đêm êm ả, kết thúc chuyến trải nghiệm đầm phá ý nghĩa và đáng nhớ.",
        highlight: "Kết thúc hành trình",
      },
    ],
  },

  inclusions: {
    included: [
      {
        title: "Thuyền gỗ bản địa",
        description: "Thuyền gỗ truyền thống di chuyển an toàn suốt hành trình trên đầm phá.",
      },
      {
        title: "Áo phao an toàn",
        description: "Trang bị đầy đủ áo phao đạt chuẩn cho người lớn và trẻ em.",
      },
      {
        title: "Ngư cụ & trải nghiệm đánh bắt",
        description: "Trang bị nơm, lưới, rớ và sự hướng dẫn tận tình của ngư dân bản địa.",
      },
      {
        title: "Ván chèo SUP & mái chèo",
        description: "Trang bị SUP chuyên dụng để tự do chèo và chụp ảnh lúc hoàng hôn.",
      },
      {
        title: "Tiệc nướng BBQ hải sản đầm phá",
        description: "Bữa ăn hải sản tươi ngon chế biến nóng hổi tại chỗ bên đầm phá.",
      },
      {
        title: "Nước suối & khăn lạnh",
        description: "Phục vụ nước uống đóng chai và khăn lạnh sạch sẽ trong suốt chuyến đi.",
      },
      {
        title: "Người bản địa đồng hành",
        description: "Ngư dân địa phương trực tiếp đón tiếp, lái thuyền và hỗ trợ mọi hoạt động.",
      },
    ],
    notIncluded: [
      {
        title: "Phương tiện di chuyển đến bến",
        description: "Quý khách tự túc di chuyển từ trung tâm TP. Huế về bến thuyền (có hướng dẫn đường đi chi tiết).",
      },
      {
        title: "Chi tiêu cá nhân ngoài chương trình",
        description: "Đồ uống có cồn thêm hoặc các yêu cầu ẩm thực riêng ngoài thực đơn BBQ có sẵn.",
      },
    ],
    practicalNotes: [
      "Quý khách nên chuẩn bị 1 bộ quần áo dự phòng để thay nếu tham gia chèo SUP hoặc lội nước.",
      "Nên mang dép lê, sandal hoặc giày chống nước dễ tháo.",
      "Mang theo kem chống nắng, mũ nón rộng vành và bao chống nước cho điện thoại.",
      "Hoạt động phụ thuộc vào thời tiết; gia đình luôn theo dõi chặt chẽ để đảm bảo an toàn tuyệt đối.",
    ],
  },

  familyStory: {
    badge: "Chân thành & Bản địa",
    heading: "Gia đình làng chài gắn bó cùng con nước Tam Giang",
    subheading: "Đón tiếp bạn bằng lòng hiếu khách mộc mạc của người xứ Huế",
    paragraphs: [
      "Sinh ra và lớn lên bên mép sóng Phá Tam Giang, gia đình Chú Huyền bao đời nay gắn liền với chiếc thuyền gỗ, tấm lưới rớ và con tôm, con cá của vùng đầm phá nước lợ lớn nhất Đông Nam Á.",
      "Khi mở cửa đón khách đến trải nghiệm, gia đình chỉ mong muốn mang đến cho bạn một buổi chiều thật thảnh thơi — không màu mè, không áp lực, chỉ có sự bình yên của thiên nhiên và những câu chuyện đời thường chân chất.",
      "Mỗi bữa ăn dọn ra là hải sản tươi ngon nhất trong ngày, mỗi nụ cười trao đi là sự trân quý tình cảm của những người khách phương xa ghé thăm.",
    ],
    quote: "Đến với gia đình, khách như người thân phương xa ghé chơi nhà, cùng ngồi thuyền ngắm phá, ăn con cá nướng mộc mạc đậm vị quê.",
    quoteAuthor: "Chú Huyền — Chủ thuyền & Người điều hành bản địa",
    imageSrc: "/images/tamgiang/host-family.jpg",
    imageAlt: "Chú Huyền - Người chủ thuyền ngư dân bản địa Tam Giang cười ấm áp bên chiếc thuyền gỗ",
  },

  gallery: {
    heading: "Hình ảnh chân thực từ đầm phá",
    subheading: "Những khoảnh khắc tự nhiên được ghi lại trong các chuyến trải nghiệm",
    description: "Tất cả hình ảnh thể hiện chân thật không gian đầm phá, đời sống làng chài và niềm vui mộc mạc của du khách.",
    photos: [
      {
        id: "g1",
        src: "/images/tamgiang/hero-sunset.jpg",
        alt: "Thuyền gỗ nằm bình yên trên mặt nước Tam Giang lúc hoàng hôn",
        caption: "Mặt nước phẳng lặng như gương lúc chiều tà",
        tag: "Hoàng hôn",
        span: "col-span-1 md:col-span-2 row-span-2",
      },
      {
        id: "g2",
        src: "/images/tamgiang/sup-sunset.jpg",
        alt: "Khách chèo ván SUP trên đầm phá Tam Giang lúc ráng chiều",
        caption: "Chèo SUP thư thái giữa ráng chiều rực rỡ",
        tag: "Hoạt động SUP",
      },
      {
        id: "g3",
        src: "/images/tamgiang/seafood-bbq.jpg",
        alt: "Mâm tôm cá nướng than BBQ phục vụ trên lá chuối tươi",
        caption: "Tiệc BBQ hải sản đầm phá thơm nức",
        tag: "Ẩm thực",
      },
      {
        id: "g4",
        src: "/images/tamgiang/boat-ride.jpg",
        alt: "Nhóm du khách tươi cười ngồi trên thuyền gỗ mặc áo phao ngắm cảnh",
        caption: "Nụ cười rạng rỡ của du khách trên thuyền gỗ",
        tag: "Du khách",
        span: "col-span-1 md:col-span-2",
      },
      {
        id: "g5",
        src: "/images/tamgiang/local-fishing.jpg",
        alt: "Ngư dân kéo nơm cá truyền thống trên sông nước",
        caption: "Trải nghiệm nghề chài lưới truyền thống",
        tag: "Đời sống",
      },
      {
        id: "g6",
        src: "/images/tamgiang/twilight-lagoon.jpg",
        alt: "Toàn cảnh đầm phá Tam Giang trong ánh sáng chạng vạng blue hour huyền ảo",
        caption: "Vẻ đẹp tĩnh mịch của Phá Tam Giang khi trời sập tối",
        tag: "Cảnh sắc",
        span: "col-span-1 md:col-span-2",
      },
    ],
  },

  trust: {
    heading: "An tâm trọn vẹn khi trải nghiệm",
    subheading: "Minh bạch thông tin, an toàn hàng đầu và hỗ trợ chu đáo",
    pillars: [
      {
        title: "Định danh thực tế rõ ràng",
        description: "Điểm bến thuyền có vị trí xác thực trên Google Maps, thông tin liên hệ chính chủ không qua môi giới.",
        iconName: "MapPinCheck",
      },
      {
        title: "100% Trang bị an toàn",
        description: "Trang bị đầy đủ áo phao đạt chuẩn cho tất cả hành khách, thuyền gỗ kiểm tra kỹ lưỡng trước mỗi chuyến đi.",
        iconName: "ShieldCheck",
      },
      {
        title: "Kết nối trực tiếp gia đình",
        description: "Trao đổi trực tiếp qua điện thoại hoặc Zalo với người điều hành, nhận tư vấn và phản hồi nhanh chóng.",
        iconName: "PhoneCall",
      },
      {
        title: "Chính sách linh hoạt theo thời tiết",
        description: "Luôn đặt sự an toàn lên trên hết; chủ động hỗ trợ dời ngày hoặc hủy miễn phí nếu điều kiện thời tiết xấu.",
        iconName: "CloudSun",
      },
    ],
    mapsLinkText: "Xem vị trí Bến thuyền Chú Huyền trên Google Maps",
    mapsNote: "Được định danh là 'Tour Du Lịch Phá Tam Giang - Chú Huyền' trên bản đồ.",
  },

  faq: {
    heading: "Câu hỏi thường gặp",
    subheading: "Những thông tin bạn thường quan tâm trước khi gửi yêu cầu đặt tour",
    items: [
      {
        id: "faq-timing",
        question: "Tour khởi hành lúc mấy giờ và kéo dài trong bao lâu?",
        answer:
          "Tour thường tập trung tại bến vào khoảng 15:40 chiều để chuẩn bị xuất bến lúc 16:00, đón trọn khung giờ hoàng hôn đẹp nhất trên đầm phá và kết thúc vào khoảng 19:45 tối.",
      },
      {
        id: "faq-audience",
        question: "Trẻ em và người lớn tuổi có tham gia được không?",
        answer:
          "Hoàn toàn được. Thuyền gỗ di chuyển êm ái, trang bị áo phao đầy đủ kích cỡ cho cả trẻ nhỏ. Các hoạt động như chèo SUP hoặc lội nước là tự chọn tùy theo sở thích và sức khỏe của từng thành viên.",
      },
      {
        id: "faq-clothing",
        question: "Cần chuẩn bị trang phục và đồ dùng gì khi đi tour?",
        answer:
          "Bạn nên mặc trang phục thoải mái, mang theo dép lê hoặc giày dễ tháo nước. Nên chuẩn bị thêm 1 bộ quần áo dự phòng để thay nếu tham gia chèo SUP, cùng nón mũ và kem chống nắng.",
      },
      {
        id: "faq-weather",
        question: "Nếu thời tiết mưa gió bất lợi thì xử lý thế nào?",
        answer:
          "Gia đình luôn theo dõi sát dự báo thời tiết và con nước. Nếu thời tiết không đảm bảo an toàn, gia đình sẽ chủ động thông báo sớm để quý khách dời sang ngày phù hợp hoặc hủy chuyến hoàn toàn miễn phí.",
      },
      {
        id: "faq-transport",
        question: "Làm thế nào để di chuyển từ trung tâm TP. Huế đến bến thuyền?",
        answer:
          "Từ trung tâm Huế đến bến thuyền Chú Huyền khoảng 15–20km (mất 30–40 phút chạy xe máy hoặc ô tô/taxi theo hướng cầu Tam Giang / Quốc lộ 49B). Gia đình sẽ gửi định vị Google Maps chính xác và hướng dẫn đường đi dễ nhất cho bạn.",
      },
      {
        id: "faq-booking-flow",
        question: "Quy trình gửi yêu cầu đặt tour diễn ra như thế nào?",
        answer:
          "Bạn chỉ cần điền ngày mong muốn và số lượng khách vào biểu mẫu bên dưới. Đây là yêu cầu đặt trải nghiệm (chưa phải thanh toán hay xác nhận đặt chỗ). Gia đình sẽ trực tiếp gọi điện hoặc nhắn tin Zalo để xác nhận chi tiết cùng bạn.",
      },
    ],
  },

  contact: {
    heading: "Thông tin liên hệ & Điểm đón",
    subheading: "Kết nối trực tiếp cùng gia đình điều hành Tour Chú Huyền",
    description:
      "Bạn có bất kỳ thắc mắc nào về hành trình, đường đi hoặc muốn đặt lịch theo nhóm riêng? Hãy liên hệ ngay với chúng tôi.",
    phoneDisplay: "0332 279 474",
    phoneHref: "tel:+84332279474",
    zaloLabel: "Nhắn tin qua Zalo",
    zaloHref: "https://zalo.me/0332279474",
    mapsPlaceKey: "chu_huyen_boat_pier",
    mapsPlaceName: "Tour Du Lịch Phá Tam Giang - Chú Huyền",
    mapsAddress: "Bến thuyền Phá Tam Giang, Thừa Thiên Huế",
    mapsCoordinates: {
      lat: 16.6278753,
      lng: 107.5060075,
    },
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=16.6278753,107.5060075+(Tour+Du+L%E1%BB%8Bch+Ph%C3%A1+Tam+Giang+-+Ch%C3%BA+Huy%E1%BB%81n)&t=&z=15&ie=UTF8&iwloc=&output=embed&hl=vi",
    mapsHref:
      "https://www.google.com/maps/place/Tour+Du+l%E1%BB%8Bch+Ph%C3%A1+Tam+Giang+-+Ch%C3%BA+Huy%E1%BB%81n/@16.6279712,107.5035184,17z/data=!4m10!1m2!2m1!1zdG91ciBkdSBs4buLY2ggcGjDoSB0YW0gZ2lhbmcgLSBjaMO6IGh1eeG7gW4!3m6!1s0x31410f0d57c95e1d:0x559dd7c2099bd6dd!8m2!3d16.6278753!4d107.5060075!15sCix0b3VyIGR1IGzhu4tjaCBwaMOhIHRhbSBnaWFuZyAtIGNow7ogaHV54buBbpIBDXRvdXJfb3BlcmF0b3LgAQA!16s%2Fg%2F11zf720lcw?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
    directionsTip:
      "Từ trung tâm TP. Huế, đi theo Quốc lộ 49B hướng về đầm phá Tam Giang. Khi đến gần khu vực bến thuyền Chú Huyền, bạn có thể gọi hotline để được đón tiếp chỉ đường tận tình.",
  },

  footer: {
    brandName: "Tour Du Lịch Phá Tam Giang - Chú Huyền",
    brandTagline: "Trải nghiệm đầm phá mộc mạc cùng ngư dân bản địa xứ Huế",
    phone: "0332 279 474",
    zalo: "0332 279 474",
    address: "Bến thuyền Phá Tam Giang, Thừa Thiên Huế",
    copyrightYear: 2026,
    quickLinks: [
      { label: "Trải nghiệm", href: "/vi#trai-nghiem" },
      { label: "Lịch trình", href: "/vi#lich-trinh" },
      { label: "Dịch vụ", href: "/vi#dich-vu" },
      { label: "Câu chuyện", href: "/vi#cau-chuyen" },
      { label: "Câu hỏi thường gặp", href: "/vi#faq" },
      { label: "Điểm đón & Bản đồ", href: "/vi/lien-he" },
      { label: "Gửi yêu cầu đặt tour", href: "/vi/dat-trai-nghiem" },
    ],
  },
};
