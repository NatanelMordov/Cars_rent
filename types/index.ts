import { MouseEventHandler } from "react";

export interface CustomButtonProps{
    title : string;
    containerStyles?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
    btnType?: "button" | "submit";
    rightIcon?: string;
    isDisabled?:boolean;
}
export interface SearchManufacturProps{
    manufactur: string;
    setManufactor:(manufactur: string)=>void;
}

export interface SearchModelProps{
    model: string;
    setModel:(model: string)=>void;
}


export interface CarProps{
    id: number,
    manufacturers: string,
    model:string,
    yearsOfProduction: number,
    fuels: string,
    gear: string,
    priceperday: number,
    inventory: number,
    averageRating?: number;

}
export interface FilterProps{
  manufactur: string;
  year: number;
  fuel: string;
  limit: number;
  model: string;
  location: string;
}
export interface OptionsProps{
    title: string;
    value: string;
}
export interface CustomFilterProps{
    title: string;
    options: string[];
}