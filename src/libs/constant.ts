

export const BASE_REST_URL = import.meta.env.BASE_REST_URL || "https://localhost:7100/api";
export const BASE_WS_URL = import.meta.env.BASE_WS_URL || "https://localhost:7100";

export const REST_SEGMENT = {
    AUTH: `/auth`,
    FILE: `/file`,
    CHAT: `/chat`,
    GROUP: `/group`,
    USER: `/user`,
}

export const CONNECTION_MAX_ATTEMPT = 5;