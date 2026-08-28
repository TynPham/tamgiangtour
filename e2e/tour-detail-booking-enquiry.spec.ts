import { test, expect } from "@playwright/test";

const TOUR_DETAIL_PATH = "/vi/trai-nghiem-pha-tam-giang";

const validFormData = {
  date: "2026-08-29",
  guests: "2",
  name: "Nguyễn Văn An",
  phone: "0332279474",
  notes: "Gia đình có 1 bé nhỏ",
};

test.describe("Vietnamese Tour Detail — Booking Enquiry Journey", () => {
  test("CTA → enquiry anchor focuses heading without auto-focusing inputs", async ({
    page,
  }) => {
    await page.goto(TOUR_DETAIL_PATH);

    const heading = page.locator("#booking-enquiry-heading");
    await expect(heading).toBeAttached();

    const cta = page.getByRole("link", { name: "Gửi yêu cầu đặt trải nghiệm" }).first();
    await expect(cta).toHaveAttribute("href", "#booking-enquiry");
    await cta.click();

    await expect(page).toHaveURL(`${TOUR_DETAIL_PATH}#booking-enquiry`);
    await expect(heading).toBeFocused();

    // Verify inputs remain blank and are not focused
    const dateInput = page.locator('input[name="requestedTourDate"]');
    await expect(dateInput).toHaveValue("");
    await expect(dateInput).not.toBeFocused();
  });

  test("direct anchored visit focuses section heading and renders compact context", async ({
    page,
  }) => {
    await page.goto(`${TOUR_DETAIL_PATH}#booking-enquiry`);

    const heading = page.locator("#booking-enquiry-heading");
    await expect(heading).toBeFocused();

    // Verify compact tour context is visible
    await expect(
      page.getByText("Gửi ngày bạn muốn đi và số lượng khách. Đây là yêu cầu đặt trải nghiệm, chưa phải xác nhận đặt chỗ."),
    ).toBeVisible();

    // Verify fields rendered in approved mobile order
    const fields = page.locator('form input:not([name="website"]), form textarea');
    await expect(fields).toHaveCount(5);
    await expect(fields.nth(0)).toHaveAttribute("name", "requestedTourDate");
    await expect(fields.nth(1)).toHaveAttribute("name", "totalGuestCount");
    await expect(fields.nth(2)).toHaveAttribute("name", "guestName");
    await expect(fields.nth(3)).toHaveAttribute("name", "phoneNumber");
    await expect(fields.nth(4)).toHaveAttribute("name", "guestNotes");
  });

  test("client validation presents linked error summary without making server requests", async ({
    page,
  }) => {
    let serverRequestMade = false;
    await page.route("**/api/booking-enquiries", async (route) => {
      serverRequestMade = true;
      await route.fulfill({ status: 500, json: { error: "Should not be called" } });
    });

    await page.goto(TOUR_DETAIL_PATH);

    // Submit empty form
    const submitBtn = page.getByRole("button", { name: "Gửi yêu cầu đặt trải nghiệm" });
    await submitBtn.click();

    expect(serverRequestMade).toBe(false);

    // Error summary is displayed and focused
    const errorSummary = page.locator('form [role="alert"]');
    await expect(errorSummary).toBeVisible();
    await expect(errorSummary).toContainText("Vui lòng kiểm tra lại các mục sau");
    await expect(errorSummary).toBeFocused();

    // Inline errors are present
    await expect(
      page.locator('[data-slot="form-message"]').getByText("Chọn ngày hôm nay hoặc ngày sau."),
    ).toBeVisible();
    await expect(
      page.locator('[data-slot="form-message"]').getByText("Nhập số lượng khách từ 1 trở lên."),
    ).toBeVisible();
    await expect(
      page.locator('[data-slot="form-message"]').getByText("Nhập họ và tên (tối đa 100 ký tự)."),
    ).toBeVisible();
    await expect(
      page.locator('[data-slot="form-message"]').getByText("Nhập số điện thoại hợp lệ (8–15 chữ số)."),
    ).toBeVisible();
  });

  test("successful durable submission displays honest in-place receipt", async ({
    page,
  }) => {
    let capturedPayload: unknown = null;
    await page.route("**/api/booking-enquiries", async (route) => {
      capturedPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ outcome: "recorded", replayed: false }),
      });
    });

    await page.goto(TOUR_DETAIL_PATH);

    // Fill valid data
    await page.fill('input[name="requestedTourDate"]', validFormData.date);
    await page.fill('input[name="totalGuestCount"]', validFormData.guests);
    await page.fill('input[name="guestName"]', validFormData.name);
    await page.fill('input[name="phoneNumber"]', validFormData.phone);
    await page.fill('textarea[name="guestNotes"]', validFormData.notes);

    const submitBtn = page.getByRole("button", { name: "Gửi yêu cầu đặt trải nghiệm" });
    await submitBtn.click();

    // Verify receipt appears
    const receipt = page.getByRole("status");
    await expect(receipt).toBeVisible();
    await expect(receipt).toContainText("Đã ghi nhận yêu cầu của bạn");
    await expect(receipt).toContainText("Đây chưa phải xác nhận đặt chỗ.");
    await expect(receipt).toContainText(validFormData.guests);

    // Form is unmounted in place
    await expect(page.locator("form")).not.toBeAttached();

    expect(capturedPayload).toMatchObject({
      locale: "vi",
      sourcePage: "tour_detail",
      requestedTourDate: validFormData.date,
      totalGuestCount: 2,
      guestName: validFormData.name,
      phoneNumber: "0332279474",
      guestNotes: validFormData.notes,
    });
  });

  test("storage failure preserves values, allows edit and successful retry", async ({
    page,
  }) => {
    let attempt = 0;
    await page.route("**/api/booking-enquiries", async (route) => {
      attempt++;
      if (attempt === 1) {
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ outcome: "storage_failed" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ outcome: "recorded", replayed: false }),
        });
      }
    });

    await page.goto(TOUR_DETAIL_PATH);

    await page.fill('input[name="requestedTourDate"]', validFormData.date);
    await page.fill('input[name="totalGuestCount"]', validFormData.guests);
    await page.fill('input[name="guestName"]', validFormData.name);
    await page.fill('input[name="phoneNumber"]', validFormData.phone);

    await page.getByRole("button", { name: "Gửi yêu cầu đặt trải nghiệm" }).click();

    // Error alert and phone fallback displayed
    await expect(
      page.getByText("Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc gọi 0332 279 474."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Gọi trực tiếp: 0332 279 474/i }),
    ).toHaveAttribute("href", "tel:+84332279474");

    // Values are preserved and editable
    const guestInput = page.locator('input[name="totalGuestCount"]');
    await expect(guestInput).toBeEnabled();
    await guestInput.fill("4");

    // Retry
    const retryBtn = page.getByRole("button", { name: "Thử lại" });
    await retryBtn.click();

    await expect(page.getByRole("status")).toContainText("Đã ghi nhận yêu cầu của bạn");
  });

  test("ambiguous/network failure locks payload and allows safe same-key retry", async ({
    page,
  }) => {
    let attempt = 0;
    await page.route("**/api/booking-enquiries", async (route) => {
      attempt++;
      if (attempt === 1) {
        await route.abort("failed");
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ outcome: "recorded", replayed: true }),
        });
      }
    });

    await page.goto(TOUR_DETAIL_PATH);

    await page.fill('input[name="requestedTourDate"]', validFormData.date);
    await page.fill('input[name="totalGuestCount"]', validFormData.guests);
    await page.fill('input[name="guestName"]', validFormData.name);
    await page.fill('input[name="phoneNumber"]', validFormData.phone);

    await page.getByRole("button", { name: "Gửi yêu cầu đặt trải nghiệm" }).click();

    // Ambiguous failure alert displayed
    await expect(
      page.getByText(
        "Chưa thể xác minh yêu cầu đã được ghi nhận. Bạn có thể thử lại an toàn hoặc gọi 0332 279 474.",
      ),
    ).toBeVisible();

    // Fields locked during ambiguous state
    await expect(page.locator('input[name="guestName"]')).toBeDisabled();

    // Safe retry
    const retryBtn = page.getByRole("button", { name: "Thử lại an toàn" });
    await retryBtn.click();

    await expect(page.getByRole("status")).toContainText("Đã ghi nhận yêu cầu của bạn");
  });

  test("keyboard focus behavior allows full navigation and error recovery", async ({
    page,
  }) => {
    await page.goto(TOUR_DETAIL_PATH);

    // Focus and click the error summary link to jump to field
    await page.getByRole("button", { name: "Gửi yêu cầu đặt trải nghiệm" }).click();
    const errorSummary = page.locator('form [role="alert"]');
    await expect(errorSummary).toBeFocused();

    const dateLink = page.getByRole("link", { name: "Chọn ngày hôm nay hoặc ngày sau." });
    await dateLink.click();

    const dateInput = page.locator('input[name="requestedTourDate"]');
    await expect(dateInput).toBeFocused();
  });
});
