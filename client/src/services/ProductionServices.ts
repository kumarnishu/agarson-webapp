import { apiClient } from "./utils/AxiosInterceptor";


export const CreateMachine = async (body: { name: string, display_name: string }) => {
    return await apiClient.post(`machines`, body);
};


export const UpdateMachine = async ({ body, id }: { body: { name: string, display_name: string }, id: string }) => {
    return await apiClient.put(`machines/${id}`, body);
};

export const ToogleMachine = async (id: string) => {
    return await apiClient.patch(`machines/toogle/${id}`);
};

export const GetMachines = async (hidden?: string) => {
    if (hidden) {
        return await apiClient.get(`machines?hidden=${hidden}`);
    }
    return await apiClient.get(`machines`);
};

export const CreateDye = async (body: { dye_number: number, size: string }) => {
    return await apiClient.post(`dyes`, body);
};

export const UpdateDye = async ({ body, id }: { body: { dye_number: number, size: string }, id: string }) => {
    return await apiClient.put(`dyes/${id}`, body);
};

export const ToogleDye = async (id: string) => {
    return await apiClient.patch(`dyes/toogle/${id}`);
};

export const GetDyes = async (hidden?: string) => {
    if (hidden)
        return await apiClient.get(`dyes?hidden=${hidden}`);
    else
        return await apiClient.get(`dyes`);
};

export const CreateArticle = async (body: { name: string, display_name: string, sizes: { size: string, standard_weight: number, upper_weight: number }[] }) => {
    return await apiClient.post(`articles`, body);
};

export const UpdateArticle = async ({ body, id }: { body: { name: string, display_name: string, sizes: { size: string, standard_weight: number, upper_weight: number }[] }, id: string }) => {
    return await apiClient.put(`articles/${id}`, body);
};

export const ToogleArticle = async (id: string) => {
    return await apiClient.patch(`articles/toogle/${id}`);
};

export const GetArticles = async (hidden?: string) => {
    if (hidden)
        return await apiClient.get(`articles?hidden=${hidden}`);
    else
        return await apiClient.get(`articles`);
};

export const CreateShoeWeight = async ({ body }: { body: FormData }) => {
    return await apiClient.post(`weights`, body);
}

export const UpdateShoeWeight = async ({ id, body }: { id: string, body: FormData }) => {
    return await apiClient.put(`weights/${id}`, body);
}
export const ValidateShoeWeight = async (id: string) => {
    return await apiClient.patch(`weights/validate/${id}`);
}
export const GetShoeWeights = async () => {
    return await apiClient.get(`weights`);
}
export const GetMyShoeWeights = async (dye: string | undefined) => {
    if (dye)
        return await apiClient.get(`weights/me?dye=${dye}`);
    else
        return await apiClient.get(`weights/me`);
}
export const GetMyProductions = async ({ date, machine }: { date: string, machine?: string }) => {
    if (machine)
        return await apiClient.get(`productions/me/?date=${date}&machine=${machine}`);
    else
        return await apiClient.get(`productions/me/?date=${date}`);
}

export const CreateProduction = async (body: {
    machine: string,
    thekedar: string,
    articles: string[],
    manpower: number,
    production: number,
    big_repair: number,
    small_repair: number,
    production_hours: number,
    date: String
}) => {
    return await apiClient.post(`productions`, body);
}

export const UpdateProduction = async ({ id, body }: {
    body: {
        machine: string,
        thekedar: string,
        production_hours: number,
        articles: string[],
        manpower: number,
        production: number,
        big_repair: number,
        small_repair: number,
        date: String
    }, id: string

}) => {
    return await apiClient.put(`productions/${id}`, body);
}

export const GetProductions = async () => {
    return await apiClient.get(`productions`);
}


export const UpdateRepairDyeReport = async ({ id, body }: {
    id: string, body: {
        machine: string,
        dye: string,
        problem: string
    }
}) => {
    return await apiClient.put(`repair_dye_reports/${id}`, body);
}

export const GetRepairDyeReports = async () => {
    return await apiClient.get(`repair_dye_reports`);
}

export const UpdateRunningMouldReport = async ({ id, body }: {
    id: string,
    body: {
        machine: string,
        dye: string,
        article: string
    }
}) => {
    return await apiClient.put(`running_mould_reports/${id}`, body);
}


export const GetRunningMouldReports = async () => {
    return await apiClient.get(`running_mould_reports`);
}

export const BulkUploadMachines = async (body: FormData) => {
    return await apiClient.put(`machines/upload/bulk`, body);
}
export const BulkUploadDyes = async (body: FormData) => {
    return await apiClient.put(`dyes/upload/bulk`, body);
}
export const BulkUploadArticles = async (body: FormData) => {
    return await apiClient.put(`articles/upload/bulk`, body);
}