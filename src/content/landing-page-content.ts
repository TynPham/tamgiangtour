/** Vietnamese presentation content derived from the canonical V1 tour contract. */
import {
  PRIMARY_MEETING_POINT,
  V1_PUBLIC_CONTACT,
  V1_TOUR,
  type MeetingPoint,
} from "@/src/content/v1-tour";
import { V1_TOUR_VI } from "@/src/content/v1-tour-vi";
import { createAbsoluteSiteUrl } from "@/src/seo/site-metadata";

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
  imagePosition?: "center" | "bottom";
  badgeText?: string;
}

export interface ItineraryStop {
  time: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface InclusionsData {
  included: Array<{ title: string; description: string }>;
  practicalNotes: string[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  imagePosition?: "center" | "bottom";
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

export interface MeetingPointContent extends MeetingPoint {
  roleLabel: string;
  parkingText: string;
}

const formatVnd = (amount: number) =>
  `${new Intl.NumberFormat("vi-VN").format(amount)}đ/người`;

const durationText = `${V1_TOUR.durationHours.min}–${V1_TOUR.durationHours.max} giờ`;
const operatingWindowText = `${V1_TOUR.operatingWindow.meetingHour.min}:00–${V1_TOUR.operatingWindow.meetingHour.max}:00, kết thúc khoảng ${V1_TOUR.operatingWindow.finishHour.min}:00–${V1_TOUR.operatingWindow.finishHour.max}:00`;

const itineraryCopy: Record<
  (typeof V1_TOUR.referenceItinerary.stops)[number]["key"],
  { title: string; description: string; highlight: string }
> = {
  meet: {
    title: "Gặp nhau tại điểm hẹn đã xác nhận",
    description:
      "Gia đình xác nhận điểm gặp phù hợp sau khi nhận yêu cầu của khách.",
    highlight: "Gặp mặt",
  },
  depart: {
    title: "Xuất phát bằng thuyền trên Phá Tam Giang",
    description:
      "Bắt đầu hành trình trên mặt phá cùng Chú Huyền và gia đình.",
    highlight: "Đi thuyền",
  },
  observe_do_no: {
    title: "Xem người dân địa phương đổ nò",
    description:
      "Quan sát hoạt động đổ nò quen thuộc trên phá; không cam kết khách sẽ bắt được thủy sản.",
    highlight: "Đời sống địa phương",
  },
  sup: {
    title: "Trải nghiệm SUP khi điều kiện phù hợp",
    description:
      "Thiết bị SUP được chuẩn bị; việc tham gia phụ thuộc điều kiện thực tế và sự xác nhận của gia đình.",
    highlight: "Hoạt động SUP",
  },
  sunset_bbq: {
    title: "Thời gian ngắm chiều và dùng BBQ hải sản",
    description:
      "Dùng bữa BBQ do gia đình chuẩn bị trong khoảng thời gian hướng đến trải nghiệm hoàng hôn; cảnh hoàng hôn phụ thuộc thời tiết.",
    highlight: "BBQ & hoàng hôn",
  },
  finish: {
    title: "Kết thúc trải nghiệm",
    description:
      "Thời gian kết thúc thực tế có thể thay đổi theo mùa và điều kiện trong ngày.",
    highlight: "Kết thúc",
  },
};

const inclusionCopy: Record<
  (typeof V1_TOUR.inclusions)[number]["key"],
  { title: string; description: string }
> = {
  boat: { title: "Thuyền", description: "Phương tiện đi lại trên đầm phá trong chương trình." },
  life_jackets: { title: "Áo phao", description: "Áo phao được chuẩn bị cho chuyến đi." },
  local_host: {
    title: "Chú Huyền đồng hành",
    description: "Chủ thuyền, ngư dân địa phương trực tiếp đồng hành cùng khách.",
  },
  do_no_equipment: {
    title: "Dụng cụ liên quan đến đổ nò",
    description: "Dụng cụ phục vụ phần quan sát và tìm hiểu hoạt động đổ nò.",
  },
  sup_equipment: {
    title: "Thiết bị SUP",
    description: "Thiết bị được chuẩn bị; hoạt động phụ thuộc điều kiện thực tế.",
  },
  seafood_bbq: {
    title: "BBQ hải sản",
    description: "Bữa BBQ hải sản do gia đình chuẩn bị.",
  },
  bottled_water: { title: "Nước đóng chai", description: "Nước uống đóng chai trong chương trình." },
  tissues: { title: "Khăn giấy", description: "Khăn giấy được gia đình chuẩn bị." },
};

const meetingPoints: MeetingPointContent[] = V1_TOUR.meetingPoints.map(
  (point) => ({
    ...point,
    roleLabel: point.role === "primary" ? "Điểm hẹn chính" : "Điểm hẹn thay thế",
    parkingText: "Có chỗ đậu xe máy và ô tô",
  }),
);

const standardPrice = V1_TOUR.pricing.options[0];
const specialPrice = V1_TOUR.pricing.options[1];
const includedItems = V1_TOUR.inclusions.map(({ key }) => inclusionCopy[key]);
const specialAdditionCopy: Record<
  (typeof specialPrice.additions)[number],
  string
> = {
  crab: "cua",
  squid: "mực",
  brown_fish_porridge: "cháo cá nâu",
};
const specialAdditionsText = specialPrice.additions
  .map((addition) => specialAdditionCopy[addition])
  .join(", ");
const includedTitlesText = includedItems
  .map((item) => item.title.toLocaleLowerCase("vi-VN"))
  .join(", ");

export const LANDING_PAGE_CONTENT = {
  tour: {
    key: V1_TOUR.key,
    name: V1_TOUR_VI.name,
    format:
      "Gia đình vận hành; chuyến riêng hoặc ghép nhóm được sắp xếp linh hoạt",
    duration: durationText,
    operatingWindow: operatingWindowText,
    groupSize: `Tối thiểu ${V1_TOUR.pricing.minimumGuests} khách; quy mô thường khoảng ${V1_TOUR.pricing.typicalGuestCount.min}–${V1_TOUR.pricing.typicalGuestCount.max} khách`,
    summary:
      "Đi thuyền trên Phá Tam Giang cùng Chú Huyền, xem người dân đổ nò, trải nghiệm SUP khi điều kiện phù hợp, dùng BBQ hải sản do gia đình chuẩn bị và dành thời gian đón chiều trên mặt phá.",
  },
  pricing: {
    currency: V1_TOUR.pricing.currency,
    unit: V1_TOUR.pricing.unit,
    minimumGuests: V1_TOUR.pricing.minimumGuests,
    options: [
      {
        key: standardPrice.key,
        label: "Gói tiêu chuẩn",
        amount: standardPrice.amount,
        display: formatVnd(standardPrice.amount),
        description: "Bao gồm các nội dung và dịch vụ cơ bản của trải nghiệm.",
      },
      {
        key: specialPrice.key,
        label: "Gói đặc biệt",
        amount: specialPrice.amount,
        display: formatVnd(specialPrice.amount),
        description: `Bao gồm gói tiêu chuẩn, thêm ${specialAdditionsText}.`,
      },
    ],
  },
  policies: {
    deposit: `Đặt cọc ${V1_TOUR.bookingPolicy.depositPercent}% giá trị đặt chỗ.`,
    changeOrCancel: `Báo trước ít nhất ${V1_TOUR.bookingPolicy.changeOrCancelNoticeHours} giờ: hoàn cọc hoặc đổi ngày.`,
    lateCancellation: `Hủy dưới ${V1_TOUR.bookingPolicy.changeOrCancelNoticeHours} giờ: mất tiền cọc.`,
    noShow: "Không đến theo lịch đã xác nhận: mất tiền cọc.",
    weather:
      "Khi mưa lớn hoặc gió mạnh khiến trải nghiệm không phù hợp, gia đình có thể hủy hoặc dời lịch. Nếu gia đình hủy vì thời tiết, khách được hoàn 100% tiền cọc hoặc đổi ngày không mất phí.",
  },
  metadata: {
    title: `${V1_TOUR_VI.name} cùng ${V1_TOUR.host.publicName}`,
    description:
      "Đi thuyền, xem đổ nò, trải nghiệm SUP, dùng BBQ hải sản và đón chiều trên Phá Tam Giang cùng gia đình Chú Huyền.",
    keywords: [
      "tour phá tam giang",
      "trải nghiệm phá tam giang",
      "chèo sup tam giang",
      "đổ nò tam giang",
      "tour chú huyền tam giang",
    ],
    canonicalUrl: createAbsoluteSiteUrl("/vi"),
    ogImage: "/images/tamgiang/hero-sunset.jpg",
  },
  navigation: {
    brandName: "Phá Tam Giang",
    brandSubtitle: "Tour Gia đình Chú Huyền",
    items: [
      { label: "Trải nghiệm", href: "/vi/trai-nghiem-pha-tam-giang" },
      { label: "Lịch trình", href: "/vi#lich-trinh" },
      { label: "Dịch vụ", href: "/vi#dich-vu" },
      { label: "Câu chuyện", href: "/vi#cau-chuyen" },
      { label: "Khoảnh khắc", href: "/vi#khoanh-khac" },
      { label: "Hỏi đáp", href: "/vi#faq" },
      { label: "Liên hệ & Bản đồ", href: "/vi/lien-he" },
    ] satisfies NavigationItem[],
    ctaLabel: "Gửi yêu cầu đặt trải nghiệm",
  },
  hero: {
    badge: "Trải nghiệm cùng gia đình địa phương",
    heading: "Khám phá Đầm phá Tam Giang cùng Chú Huyền",
    subheading: "Một buổi chiều linh hoạt theo mùa và điều kiện thực tế trên Phá Tam Giang",
    description:
      "Đi thuyền, xem người dân đổ nò, trải nghiệm SUP khi điều kiện phù hợp và dùng bữa BBQ hải sản do gia đình chuẩn bị.",
    primaryCtaText: "Gửi yêu cầu đặt trải nghiệm",
    secondaryCtaText: "Xem lịch trình tham khảo",
    zaloCtaText: "Tư vấn qua Zalo",
    heroImage: "/images/tamgiang/hero-sunset.jpg",
    heroImageAlt: "Mặt nước Phá Tam Giang trong ánh chiều",
  },
  quickFacts: [
    {
      label: "Giá tiêu chuẩn",
      value: formatVnd(standardPrice.amount),
      subtext: `Áp dụng từ ${V1_TOUR.pricing.minimumGuests} khách`,
      iconName: "WalletCards",
    },
    {
      label: "Giá đặc biệt",
      value: formatVnd(specialPrice.amount),
      subtext: "Thêm cua, mực và cháo cá nâu",
      iconName: "Utensils",
    },
    {
      label: "Thời lượng",
      value: durationText,
      subtext: "Thay đổi linh hoạt theo điều kiện thực tế",
      iconName: "Clock",
    },
    {
      label: "Khung giờ dự kiến",
      value: `${V1_TOUR.operatingWindow.meetingHour.min}:00–${V1_TOUR.operatingWindow.finishHour.max}:00`,
      subtext: "Giờ gặp và kết thúc được gia đình xác nhận",
      iconName: "Sun",
    },
  ] satisfies QuickFact[],
  highlights: {
    heading: "Những trải nghiệm chính trên Phá Tam Giang",
    subheading: "Các nội dung được sắp xếp linh hoạt theo điều kiện trong ngày",
    description:
      "Chuyến đi kết hợp đời sống trên phá, hoạt động ngoài trời và bữa ăn gia đình. Một số nội dung phụ thuộc thời tiết và điều kiện thực tế.",
    items: [
      {
        id: "sup",
        tag: "Hoạt động ngoài trời",
        title: "Trải nghiệm SUP khi điều kiện phù hợp",
        description:
          "Thiết bị SUP được chuẩn bị; việc tham gia phụ thuộc thời tiết, mặt nước và xác nhận thực tế của gia đình.",
        imageSrc: "/images/tamgiang/sup-activity-real-01.jpg",
        imageAlt: "Nhóm khách chèo SUP giữa thuyền bè trên mặt nước Phá Tam Giang",
        imagePosition: "bottom",
        badgeText: "Phụ thuộc điều kiện",
      },
      {
        id: "observe-do-no",
        tag: "Đời sống trên phá",
        title: "Xem người dân địa phương đổ nò",
        description:
          "Quan sát cách người dân làm việc với nò trên đầm phá; không cam kết khách sẽ bắt được cá hoặc thủy sản.",
        imageSrc: "/images/tamgiang/lagoon-atmosphere-real-01.jpg",
        imageAlt: "Mây và ánh nắng trên mặt nước Phá Tam Giang",
        imagePosition: "bottom",
      },
      {
        id: "seafood-bbq",
        tag: "Bữa ăn gia đình",
        title: "Dùng BBQ hải sản do gia đình chuẩn bị",
        description:
          "Bữa BBQ là một phần của trải nghiệm; gói đặc biệt có thêm cua, mực và cháo cá nâu.",
        imageSrc: "/images/tamgiang/seafood-bbq.jpg",
        imageAlt: "Hình minh họa bữa BBQ hải sản",
      },
    ] satisfies HighlightItem[],
  },
  itinerary: {
    heading: "Lịch trình tham khảo",
    subheading:
      "Mốc giờ dưới đây giúp hình dung hành trình, không phải giờ vận hành cố định",
    note: `Các mốc giờ chỉ để tham khảo, không phải giờ vận hành cố định. Trải nghiệm thường kéo dài khoảng ${durationText}; giờ gặp, thứ tự hoạt động và giờ kết thúc có thể thay đổi theo mùa, thời tiết và điều kiện thực tế.`,
    stops: V1_TOUR.referenceItinerary.stops.map((stop) => ({
      time: stop.time,
      ...itineraryCopy[stop.key],
    })) satisfies ItineraryStop[],
  },
  inclusions: {
    included: includedItems,
    practicalNotes: [
      "Gia đình xác nhận điểm gặp phù hợp sau khi nhận yêu cầu.",
      "Khách tự di chuyển đến điểm gặp đã thống nhất.",
      "Hoạt động và thời gian có thể thay đổi theo điều kiện thực tế.",
    ],
  } satisfies InclusionsData,
  familyStory: {
    badge: "Gia đình địa phương",
    heading: `Cùng gia đình ${V1_TOUR.host.publicName} tìm hiểu cuộc sống trên phá`,
    subheading: `${V1_TOUR.host.publicName} là chủ thuyền, ngư dân với khoảng ${V1_TOUR.host.lagoonExperienceYears.value} năm gắn bó và làm việc trên Phá Tam Giang.`,
    paragraphs: [
      "Gia đình bắt đầu đón khách với mong muốn giới thiệu một cách gần gũi hơn về cuộc sống và văn hóa trên Phá Tam Giang.",
      "Thay vì chỉ ngắm cảnh, khách có thể đi thuyền cùng người dân, xem đổ nò, trải nghiệm những hoạt động quen thuộc trên phá và dùng bữa BBQ do gia đình chuẩn bị.",
      "Vợ Chú Huyền cũng tham gia hoạt động của gia đình và cùng chuẩn bị phần ăn cho khách.",
    ],
    imageSrc: "/images/tamgiang/lagoon-sunlight-real-01.jpg",
    imageAlt: "Ánh nắng xuyên mây trên mặt nước Phá Tam Giang",
  },
  gallery: {
    heading: "Hình ảnh thực tế từ đầm phá",
    subheading: "Một số khoảnh khắc thực tế trên mặt nước Phá Tam Giang",
    description:
      "Hình ảnh ghi lại mặt nước, ánh sáng và hoạt động SUP; điều kiện mỗi chuyến có thể khác nhau.",
    photos: [
      {
        id: "real-lagoon-atmosphere",
        src: "/images/tamgiang/lagoon-atmosphere-real-01.jpg",
        alt: "Mây và ánh nắng phản chiếu trên mặt nước Phá Tam Giang",
        caption: "Ánh sáng trên mặt nước đầm phá",
        tag: "Cảnh sắc",
        imagePosition: "bottom",
      },
      {
        id: "real-sup-activity",
        src: "/images/tamgiang/sup-activity-real-01.jpg",
        alt: "Nhóm khách chèo SUP giữa thuyền bè trên mặt nước Phá Tam Giang",
        caption: "Hoạt động SUP trên mặt nước Phá Tam Giang",
        tag: "SUP",
        imagePosition: "bottom",
      },
      {
        id: "real-lagoon-sunlight",
        src: "/images/tamgiang/lagoon-sunlight-real-01.jpg",
        alt: "Tia nắng xuyên qua mây và phản chiếu trên mặt nước Phá Tam Giang",
        caption: "Nắng xuyên mây phản chiếu trên mặt phá",
        tag: "Ánh sáng",
        imagePosition: "bottom",
      },
    ] satisfies GalleryPhoto[],
  },
  trust: {
    heading: "Thông tin rõ ràng trước khi đi",
    subheading: "Liên hệ trực tiếp, điểm gặp xác định và chính sách được thông báo trước",
    pillars: [
      {
        title: "Hai điểm gặp được ghi rõ",
        description:
          "Gia đình xác nhận điểm gặp phù hợp sau khi nhận yêu cầu của khách.",
        iconName: "MapPinCheck",
      },
      {
        title: "Áo phao được chuẩn bị",
        description: "Áo phao nằm trong danh sách dịch vụ bao gồm của chuyến đi.",
        iconName: "ShieldCheck",
      },
      {
        title: "Liên hệ trực tiếp",
        description: `Gọi điện hoặc nhắn Zalo qua số ${V1_PUBLIC_CONTACT.phoneDisplay}.`,
        iconName: "PhoneCall",
      },
      {
        title: "Linh hoạt khi thời tiết không phù hợp",
        description:
          "Gia đình có thể hủy hoặc dời lịch khi mưa lớn hoặc gió mạnh khiến trải nghiệm không phù hợp.",
        iconName: "CloudSun",
      },
    ] satisfies TrustPillar[],
    mapsLinkText: "Xem điểm gặp chính trên Google Maps",
    mapsNote: `${PRIMARY_MEETING_POINT.publicMapsName} — ${PRIMARY_MEETING_POINT.name}.`,
  },
  faq: {
    heading: "Câu hỏi thường gặp",
    subheading: "Những thông tin đã được xác nhận trước khi gửi yêu cầu",
    items: [
      {
        id: "faq-price",
        question: "Giá trải nghiệm như thế nào?",
        answer: `Gói tiêu chuẩn ${formatVnd(standardPrice.amount)}. Gói đặc biệt ${formatVnd(specialPrice.amount)}, gồm nội dung gói tiêu chuẩn và thêm ${specialAdditionsText}. Nhóm tối thiểu ${V1_TOUR.pricing.minimumGuests} khách.`,
      },
      {
        id: "faq-packages",
        question: "Mỗi gói bao gồm những gì?",
        answer: `Gói tiêu chuẩn gồm ${includedTitlesText}. Gói đặc biệt gồm toàn bộ nội dung của gói tiêu chuẩn và thêm ${specialAdditionsText}.`,
      },
      {
        id: "faq-deposit",
        question: "Cần đặt cọc bao nhiêu?",
        answer: `Tiền đặt cọc bằng ${V1_TOUR.bookingPolicy.depositPercent}% giá trị đặt chỗ. Việc gửi biểu mẫu chưa phát sinh thanh toán.`,
      },
      {
        id: "faq-change-cancel",
        question: "Nếu hủy hoặc đổi ngày thì sao?",
        answer: `Báo trước ít nhất ${V1_TOUR.bookingPolicy.changeOrCancelNoticeHours} giờ: hoàn cọc hoặc đổi ngày. Hủy dưới ${V1_TOUR.bookingPolicy.changeOrCancelNoticeHours} giờ: mất tiền cọc.`,
      },
      {
        id: "faq-no-show",
        question: "Nếu không đến theo lịch đã xác nhận thì sao?",
        answer: "Khách không đến theo lịch đã xác nhận sẽ mất tiền cọc.",
      },
      {
        id: "faq-host",
        question: "Chú Huyền là ai?",
        answer: `${V1_TOUR.host.publicName} là chủ thuyền, ngư dân với khoảng ${V1_TOUR.host.lagoonExperienceYears.value} năm gắn bó và làm việc trên Phá Tam Giang. Chuyến đi do gia đình vận hành; vợ Chú Huyền cũng tham gia và cùng chuẩn bị phần ăn cho khách.`,
      },
      {
        id: "faq-timing",
        question: "Trải nghiệm kéo dài bao lâu?",
        answer: `Khoảng ${durationText}. Thường ${operatingWindowText}; thời gian thực tế thay đổi theo mùa và điều kiện trong ngày.`,
      },
      {
        id: "faq-meeting-point",
        question: "Gặp gia đình ở đâu?",
        answer: `Có hai điểm gặp: ${meetingPoints.map((point) => point.name).join(" và ")}. Gia đình xác nhận điểm phù hợp sau khi nhận yêu cầu. Cả hai nơi có chỗ đậu xe máy và ô tô; khách tự di chuyển đến điểm đã thống nhất.`,
      },
      {
        id: "faq-weather",
        question: "Nếu mưa lớn hoặc gió mạnh thì sao?",
        answer:
          "Gia đình có thể hủy hoặc dời lịch. Nếu gia đình hủy vì thời tiết, khách được hoàn 100% tiền cọc hoặc đổi ngày không mất phí.",
      },
      {
        id: "faq-sup-availability",
        question: "SUP có luôn hoạt động không?",
        answer:
          "Không. Thiết bị SUP được chuẩn bị, nhưng việc tham gia phụ thuộc thời tiết, mặt nước và xác nhận thực tế của gia đình.",
      },
      {
        id: "faq-itinerary-flexibility",
        question: "Các mốc giờ trong lịch trình có cố định không?",
        answer: `Không. Các mốc giờ là lịch trình tham khảo. Trải nghiệm thường kéo dài khoảng ${durationText}; giờ gặp, thứ tự hoạt động và giờ kết thúc có thể thay đổi theo mùa, thời tiết và điều kiện thực tế.`,
      },
      {
        id: "faq-booking-flow",
        question: "Gửi yêu cầu có phải là xác nhận đặt chỗ không?",
        answer:
          "Không. Thông tin gửi qua biểu mẫu là yêu cầu đặt trải nghiệm. Gia đình sẽ liên hệ trực tiếp để thống nhất chuyến đi và xác nhận đặt chỗ.",
      },
      {
        id: "faq-after-enquiry",
        question: "Điều gì xảy ra sau khi gửi yêu cầu?",
        answer:
          "Yêu cầu được lưu để gia đình xem xét. Gia đình sẽ liên hệ trực tiếp để thống nhất ngày, số lượng khách, điểm gặp và xác nhận chuyến đi. Chưa có thời gian phản hồi cố định được công bố.",
      },
    ] satisfies FaqItem[],
  },
  contact: {
    heading: "Thông tin liên hệ & Điểm gặp",
    subheading: `Liên hệ trực tiếp với gia đình ${V1_TOUR.host.publicName}`,
    description:
      "Gia đình xác nhận điểm gặp phù hợp sau khi nhận yêu cầu của khách.",
    phoneDisplay: V1_PUBLIC_CONTACT.phoneDisplay,
    phoneHref: V1_PUBLIC_CONTACT.phoneHref,
    zaloLabel: "Nhắn tin qua Zalo",
    zaloHref: V1_PUBLIC_CONTACT.zaloHref,
    meetingPoints,
    mapsPlaceKey: PRIMARY_MEETING_POINT.key,
    mapsPlaceName: PRIMARY_MEETING_POINT.publicMapsName,
    mapsAddress: PRIMARY_MEETING_POINT.name,
    mapsCoordinates: PRIMARY_MEETING_POINT.coordinates,
    mapsEmbedUrl: PRIMARY_MEETING_POINT.mapsEmbedUrl,
    mapsHref: PRIMARY_MEETING_POINT.mapsHref,
    directionsTip: `Gia đình sẽ xác nhận ${meetingPoints.map((point) => point.name).join(" hoặc ")} sau khi nhận yêu cầu. Khách tự di chuyển đến điểm đã thống nhất; cả hai nơi có chỗ đậu xe máy và ô tô.`,
  },
  footer: {
    brandName: V1_TOUR_VI.name,
    brandTagline: "Đi thuyền và tìm hiểu đời sống trên phá cùng gia đình Chú Huyền",
    phone: V1_PUBLIC_CONTACT.phoneDisplay,
    zalo: V1_PUBLIC_CONTACT.zaloPhone,
    address: PRIMARY_MEETING_POINT.name,
    copyrightYear: 2026,
    quickLinks: [
      { label: "Trải nghiệm", href: "/vi/trai-nghiem-pha-tam-giang" },
      { label: "Lịch trình", href: "/vi#lich-trinh" },
      { label: "Dịch vụ", href: "/vi#dich-vu" },
      { label: "Câu chuyện", href: "/vi#cau-chuyen" },
      { label: "Câu hỏi thường gặp", href: "/vi#faq" },
      { label: "Điểm gặp & Bản đồ", href: "/vi/lien-he" },
      { label: "Gửi yêu cầu đặt trải nghiệm", href: "/vi/dat-trai-nghiem" },
    ] satisfies NavigationItem[],
  },
} as const;
