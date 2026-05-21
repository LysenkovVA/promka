type OptionalRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

declare module "*.png";
declare module "*.svg";
