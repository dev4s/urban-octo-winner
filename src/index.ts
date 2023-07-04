export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

type ServicePrices = {
    [year in ServiceYear]: number;
};

const SERVICE_PRICES: { [service in ServiceType]: ServicePrices } = {
    Photography: { 2020: 1700, 2021: 1800, 2022: 1900 },
    VideoRecording: { 2020: 1700, 2021: 1800, 2022: 1900 },
    BlurayPackage: { 2020: 300, 2021: 300, 2022: 300 },
    TwoDayEvent: { 2020: 400, 2021: 400, 2022: 400 },
    WeddingSession: { 2020: 600, 2021: 600, 2022: 600 }
};

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    let result: ServiceType[];
    switch (action.type) {
        case 'Select':
            if (!previouslySelectedServices.includes(action.service)) {
                if (action.service === "BlurayPackage" && !previouslySelectedServices.some(service => service === "Photography" || service === "VideoRecording")) {
                    result = previouslySelectedServices;
                } else {
                    result = [...previouslySelectedServices, action.service];
                }
            } else {
                result = previouslySelectedServices;
            }
            break;
        case 'Deselect':
            if (previouslySelectedServices.includes(action.service)) {
                result = previouslySelectedServices.filter(service => service !== action.service);
                if (action.service === "Photography" || action.service === "VideoRecording") {
                    if (!result.includes("Photography") && !result.includes("VideoRecording")) {
                        result = result.filter(service => service !== "BlurayPackage" && service !== "TwoDayEvent");
                    }
                }
            } else {
                result = previouslySelectedServices;
            }
            break;
        default:
            result = previouslySelectedServices;
            break;
    }
    return result;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = selectedServices.reduce((sum, service) => sum + SERVICE_PRICES[service][selectedYear], 0);
    let finalPrice = basePrice;

    if (selectedServices.includes("Photography") && selectedServices.includes("VideoRecording")) {
        finalPrice -= SERVICE_PRICES["Photography"][selectedYear];
        finalPrice -= SERVICE_PRICES["VideoRecording"][selectedYear];
        finalPrice += { 2020: 2200, 2021: 2300, 2022: 2500 }[selectedYear];
    }

    if (selectedServices.includes("WeddingSession") &&
        (selectedServices.includes("Photography") || selectedServices.includes("VideoRecording"))) {
        finalPrice -= SERVICE_PRICES["WeddingSession"][selectedYear];
        finalPrice += { 2020: 300, 2021: 300, 2022: selectedServices.includes("WeddingSession") && selectedServices.includes("Photography") ? 0 : 300 }[selectedYear];
    }
    return { basePrice, finalPrice };
};