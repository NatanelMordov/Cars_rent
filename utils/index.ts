import { CarProps,FilterProps } from "@/types";

export async function fetchCars(filters: FilterProps) {
const {manufactur, year, model, limit, fuel, location }= filters;

   
try {
    const url = new URL("http://localhost:5000/cars");

    // Add parameters to URL if exists
    if (manufactur) url.searchParams.append("manufactur", manufactur);
    if (year) url.searchParams.append("year", year.toString());
    if (model) url.searchParams.append("model", model);
    if (limit) url.searchParams.append("limit", limit.toString());
    if (fuel) url.searchParams.append("fuel", fuel);
    if (location) url.searchParams.append("location", location);

    const response = await fetch(url.toString(), { cache: "no-store" });

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

// calculateCarRent
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
    const { manufacturers, model, yearsOfProduction } = car;

    url.searchParams.append('customer', 'hrjavascript-mastery');
    url.searchParams.append('make', manufacturers);
    url.searchParams.append('modelFamily', model.split(" ")[0]);
    url.searchParams.append('zoomType', 'fullscreen');
    url.searchParams.append('modelYear', `${yearsOfProduction}`);
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

  export async function fetchFuels() {
  try {
    const response = await fetch('http://localhost:5000/fuels');
    if (!response.ok) throw new Error('Failed to fetch fuels');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchYears() {
  try {
    const response = await fetch('http://localhost:5000/years');
    if (!response.ok) throw new Error('Failed to fetch years');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchLocations() {
  try {
    const response = await fetch('http://localhost:5000/location');
    if (!response.ok) throw new Error('Failed to fetch location');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}



