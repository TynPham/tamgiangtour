import {
  type BookingEnquiryCopy,
  type BookingEnquiryTourContext,
} from "./booking-enquiry-section";
import { V1_PUBLIC_CONTACT, V1_TOUR } from "@/src/content/v1-tour";
import { V1_TOUR_VI } from "@/src/content/v1-tour-vi";

export const VIETNAMESE_TOUR_CONTEXT: BookingEnquiryTourContext = {
  key: V1_TOUR.key,
  title: V1_TOUR_VI.name,
  summary:
    "Gửi ngày bạn muốn đi và số lượng khách. Đây là yêu cầu đặt trải nghiệm, chưa phải xác nhận đặt chỗ.",
};

export const VIETNAMESE_BOOKING_ENQUIRY_COPY: BookingEnquiryCopy = {
  heading: "Gửi yêu cầu đặt trải nghiệm",
  introduction:
    "Thông tin bạn gửi chỉ được dùng để xử lý yêu cầu đặt trải nghiệm và liên hệ lại với bạn.",
  requiredHint: "Bắt buộc",
  optionalHint: "Không bắt buộc",
  fields: {
    requestedTourDate: {
      label: "Ngày mong muốn",
      error: "Chọn ngày hôm nay hoặc ngày sau.",
    },
    totalGuestCount: {
      label: "Số lượng khách",
      error: `Nhập số lượng khách từ ${V1_TOUR.pricing.minimumGuests} trở lên.`,
    },
    guestName: {
      label: "Họ và tên",
      error: "Nhập họ và tên (tối đa 100 ký tự).",
    },
    phoneNumber: {
      label: "Số điện thoại",
      error: "Nhập số điện thoại hợp lệ (8–15 chữ số).",
    },
    guestNotes: {
      label: "Ghi chú",
      error: "Ghi chú không quá 1.000 ký tự.",
      hint: "Không bắt buộc, tối đa 1.000 ký tự.",
    },
  },
  submit: "Gửi yêu cầu đặt trải nghiệm",
  submitting: "Đang gửi yêu cầu…",
  errorSummaryHeading: "Vui lòng kiểm tra lại các mục sau",
  storageFailure: {
    heading: "Chưa thể gửi yêu cầu lúc này",
    message:
      `Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc gọi ${V1_PUBLIC_CONTACT.phoneDisplay}.`,
    retry: "Thử lại",
  },
  ambiguousFailure: {
    heading: "Chưa thể xác minh yêu cầu",
    message:
      `Chưa thể xác minh yêu cầu đã được ghi nhận. Bạn có thể thử lại an toàn hoặc gọi ${V1_PUBLIC_CONTACT.phoneDisplay}.`,
    retry: "Thử lại an toàn",
  },
  conflictFailure: {
    heading: "Yêu cầu không thể gửi lại",
    message: `Vui lòng gọi ${V1_PUBLIC_CONTACT.phoneDisplay} để được hỗ trợ trực tiếp.`,
  },
  rejectedFailure: {
    heading: "Không thể gửi yêu cầu",
    message:
      `Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại sau hoặc gọi ${V1_PUBLIC_CONTACT.phoneDisplay}.`,
  },
  phoneFallback: "Gọi trực tiếp",
  receipt: {
    heading: "Đã ghi nhận yêu cầu của bạn",
    message:
      "Yêu cầu đã được lưu để gia đình xem và liên hệ lại. Đây chưa phải xác nhận đặt chỗ.",
    notConfirmed: "Đây chưa phải xác nhận đặt chỗ.",
    requestedDateLabel: "Ngày mong muốn",
    guestCountLabel: "Số lượng khách",
    preferenceNote:
      "Thông tin bạn gửi chỉ được dùng để xử lý yêu cầu đặt trải nghiệm và liên hệ lại với bạn.",
  },
};

export const VIETNAMESE_OPERATOR_PHONE = {
  display: V1_PUBLIC_CONTACT.phoneDisplay,
  href: V1_PUBLIC_CONTACT.phoneHref,
};

export const VIETNAMESE_ZALO_CONTACT = {
  phone: VIETNAMESE_OPERATOR_PHONE.display,
  href: V1_PUBLIC_CONTACT.zaloHref,
  label: "Chat qua Zalo",
  ariaLabel: `Chat qua Zalo: ${VIETNAMESE_OPERATOR_PHONE.display}`,
};
