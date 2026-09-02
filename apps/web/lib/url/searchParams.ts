"use client";

export class QueryParamsGenerator {
    readonly _searchParams = new URLSearchParams();

    constructor() {
        this._searchParams = new URLSearchParams();
    }

    setOne(
        parameterName: string,
        parameterValue?: string,
    ): QueryParamsGenerator {
        if (parameterValue)
            this._searchParams.append(parameterName, parameterValue);

        return this;
    }

    setMany(
        parameterName: string,
        parameterValues?: string[],
    ): QueryParamsGenerator {
        parameterValues?.map((paramValue) => {
            this._searchParams.append(parameterName, paramValue);
        });

        return this;
    }

    toString() {
        return `?${this._searchParams.toString()}`;
    }

    setToBrowser() {
        window.history.pushState(
            null,
            "",
            this.toString() !== ""
                ? `${window.location.pathname}${this.toString()}`
                : `${window.location.pathname}`,
        );
    }
}

export class QueryParamsExtractor {
    private readonly _searchParams: URLSearchParams;

    constructor() {
        this._searchParams = new URLSearchParams(window.location.search);
    }

    /**
     * Получить одно значение параметра
     */
    getOne(param: string): string | null {
        return this._searchParams.get(param);
    }

    /**
     * Получить все значения параметра (массив)
     */
    getAll(param: string): string[] {
        return this._searchParams.getAll(param);
    }

    /**
     * Проверить наличие параметра
     */
    has(param: string): boolean {
        return this._searchParams.has(param);
    }

    /**
     * Получить объект со всеми параметрами (первое значение для каждого)
     */
    toObject(): Record<string, string> {
        const result: Record<string, string> = {};
        for (const [key, value] of this._searchParams) {
            result[key] = value;
        }
        return result;
    }

    /**
     * Получить все параметры как Record<string, string[]>
     */
    toMultiObject(): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        for (const [key, value] of this._searchParams) {
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(value);
        }
        return result;
    }
}
