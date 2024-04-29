

export const BASE_REST_URL = import.meta.env.BASE_REST_URL || "https://localhost:7100/api";
export const BASE_WS_URL = import.meta.env.BASE_WS_URL || "https://localhost:7100";

export const REST_BASEENDPOINT = {
    auth: `${BASE_REST_URL}/auth`
}