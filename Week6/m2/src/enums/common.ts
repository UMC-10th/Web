const PAGINATION_ORDER = {
    asc: "asc",
    desc: "desc",
} as const;

type PAGINATION_ORDER = typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];

export { PAGINATION_ORDER };
