# Zalo operator-notification research

Researched: 2026-08-28

## Decision

Use **Zalo Official Account (OA) OpenAPI to send a text message into an OA-owned Group Management Function (GMF) group** containing the family/operators.

This is the simplest official mechanism that matches an internal operational alert:

- Zalo explicitly documents GMF groups for employees, including shift-reporting groups, and explicitly lists automated OpenAPI messages into GMF groups as a use case ([Zalo OA feature update](https://oa.zalo.me/home/resources/news/cap-nhat-tinh-nang-moi-thang-112024-_1276553607002998075)).
- The recipient is an active OA-owned group identified by `group_id`, not a personal Zalo account or a guessed phone/UID automation path ([GMF overview](https://developers.zalo.me/docs/official-account/nhom-chat-gmf/general)). Family members join the group as personal users; the application sends as the OA.
- Group text messages are available 24/7 in-app and out-of-app, on mobile and desktop/web, once the App and group conditions are satisfied ([group-message conditions](https://developers.zalo.me/docs/official-account/nhom-chat-gmf/tin-nhan/condition)).
- The text-message API needs no message-template registration or per-template approval. It is `POST https://openapi.zalo.me/v3.0/oa/group/message`, with an OA `access_token` header and JSON containing `recipient.group_id` and `message.text` ([text-message API](https://developers.zalo.me/docs/official-account/nhom-chat-gmf/tin-nhan/text_message)).

Do **not** model this as automation to a personal Zalo account. Direct OA-to-user UID messages require the user to have interacted with or granted interaction permission ([OA message policy](https://oa.zalo.me/home/resources/news/thong-bao-chinh-sach-gui-tin-va-quy-dinh-phi-gui-tin_1433049880779375099)). Current ZBS Template Messages are pre-reviewed business-to-user transaction/after-sales messages sent by UID or phone number, so they add template setup and do not fit an internal operator group as closely ([official OA messaging guide](https://oa.zalo.me/home/resources/library/cham-soc-khach-hang-hieu-qua-voi-nhan-tin-va-goi-thoai_729563123387551711)).

## Required Zalo setup before implementation

The owner must complete all of the following first:

1. Create and verify a Zalo Official Account with an eligible paid OA plan/entitlement for OpenAPI and GMF. Zalo states GMF is for verified OAs and OpenAPI is paid; current plan names and entitlements should be confirmed in the live pricing page because older GMF documentation still names legacy plans ([GMF policy](https://oa.zalo.me/home/resources/news/_4601792943864106455), [OpenAPI guide](https://oa.zalo.me/home/resources/library/tinh-nang-mo-rong-nang-cap-zalo-oa_2410156908111809541)).
2. Create and activate a Zalo App; Zalo requires an App to use OA OpenAPI ([App creation](https://developers.zalo.me/docs/official-account/bat-dau/khoi-tao-ung-dung)).
3. Enable/request the App permissions required by the GMF documentation: sending messages/notifications through the OA and managing group information ([group-message conditions](https://developers.zalo.me/docs/official-account/nhom-chat-gmf/tin-nhan/condition), [text-message API](https://developers.zalo.me/docs/official-account/nhom-chat-gmf/tin-nhan/text_message)).
4. Link and authorize the App to act for the OA. The OA admin must approve the OAuth authorization; the result is an OA access token plus rotating refresh token ([OAuth v4 authorization](https://developers.zalo.me/docs/official-account/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung-new)).
5. Create an OA-owned GMF group, have the family/operator personal accounts request or accept membership, approve them where required, and retain the resulting `group_id`. Link invitations require the user to confirm and a group leader/deputy to approve; OA Manager invitations are limited to users following the OA ([GMF policy](https://oa.zalo.me/home/resources/news/_4601792943864106455)).

No ZBS/ZNS template should be created for this selected mechanism.

## Server-only credentials and configuration

Provision, without committing values:

- `ZALO_APP_ID` — Zalo App ID (configuration, not a secret).
- `ZALO_APP_SECRET` — App secret/`secret_key`; server-only secret.
- `ZALO_OA_REFRESH_TOKEN` — initial OA refresh token; server-only secret.
- `ZALO_GMF_GROUP_ID` — target active GMF group identifier (configuration; keep server-side).
- Optionally `ZALO_OA_ID` for validation/operations; the send endpoint itself uses the token and `group_id`.

Do not rely on a fixed access token: Zalo documents a 25-hour access-token lifetime. A refresh token lasts three months, is single-use, and each successful refresh returns a replacement refresh token, so production needs secure durable storage and atomic rotation of the current refresh token rather than an immutable environment value alone ([OAuth v4 authorization](https://developers.zalo.me/docs/official-account/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung-new)). The App secret and all access/refresh tokens must remain server-only.

## Can implementation proceed now?

**No. Stop before implementation.** The selected official mechanism depends on owner-provisioned OA/App/account setup, permissions/authorization, a live GMF group, and issued credentials/identifiers. Resume only after those prerequisites exist and the owner supplies the server-side configuration through the deployment secret store.
