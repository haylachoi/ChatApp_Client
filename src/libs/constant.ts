

export const BASE_REST_URL = import.meta.env.BASE_REST_URL || "https://localhost:7100/api";
export const BASE_WS_URL = import.meta.env.BASE_WS_URL || "https://localhost:7100";

export const REST_SEGMENT = {
    AUTH: `${BASE_REST_URL}/auth`,
    FILE: `${BASE_REST_URL}/file`,
    CHAT: `${BASE_REST_URL}/chat`,
}