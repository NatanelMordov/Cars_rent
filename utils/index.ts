import { CarProps,FilterProps } from "@/types";

export async function fetchCars(filters: FilterProps) {
const {manufactur, year, model, limit, fuel }= filters;

   
try {
    const url = new URL("http://localhost:5000/cars");

    // Add parameters to URL if exists
    if (manufactur) url.searchParams.append("manufactur", manufactur);
    if (year) url.searchParams.append("year", year.toString());
    if (model) url.searchParams.append("model", model);
    if (limit) url.searchParams.append("limit", limit.toString());
    if (fuel) url.searchParams.append("fuel", fuel);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Error fetching cars");
    }
																																																							
						

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching cars");
  }
    
}

// פונקציה לחישוב עלות השכרה
export const calculateCarRent = (city_mpg: number, year: number) => {
    const basePricePerDay = 210; // Base rental price per day in dollars
    const mileageFactor = 0.2; // Additional rate per mile driven
    const ageFactor = 0.05; // Additional rate per year of vehicle age
  
    // Calculate additional rate based on mileage and age
    const mileageRate = city_mpg * mileageFactor;
    const ageRate = (new Date().getFullYear() - year) * ageFactor;
  
    // Calculate total rental rate per day
    const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  
    return rentalRatePerDay.toFixed(0);
};


export const generateCarImageUrl = (car: CarProps, angel?: string ) =>{
    const url = new URL("https://cdn.imagin.studio/getimage");
    const { make, model, year } = car;

    url.searchParams.append('customer', 'hrjavascript-mastery');
    url.searchParams.append('make', make);
    url.searchParams.append('modelFamily', model.split(" ")[0]);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('modelYear', `${year}`);
    url.searchParams.append('angel', `${angel}`);
    return `${url}`;
}


export const updateSearchParams = (type: string, value: string) => {
    // Get the current URL search params
    const searchParams = new URLSearchParams(window.location.search);
  
    // Set the specified search parameter to the given value
    searchParams.set(type, value);
  
    // Set the specified search parameter to the given value
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  
    return newPathname;
  };