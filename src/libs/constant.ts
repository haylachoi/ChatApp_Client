

const BASE = "://192.168.1.12:7800"

export const BASE_REST_URL = import.meta.env.BASE_REST_URL || `http${BASE}/api`;
export const BASE_WS_URL = import.meta.env.BASE_WS_URL ||  `http${BASE}`;

export const REST_SEGMENT = {
    AUTH: `/auth`,
    FILE: `/file`,
    CHAT: `/chat`,
    GROUP: `/group`,
    USER: `/user`,
}

export const CONNECTION_MAX_ATTEMPT = 5;