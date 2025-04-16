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
export interface CarProps{
    City_Mpg:number,
    class:string,
    combination_mpg:number,
    cylinders:number,
    displacement:number,
    drive:string,
    highway_mpg:number,
    make:string,
    model:string,
    transmission:string,
    year:number;
}
export interface FilterProps{
  manufactur: string;
  year: number;
  fuel: string;
  limit: number;
  model: string;
}
export interface OptionsProps{
    title: string;
    value: string;
}
export interface CustomFilterProps{
    title: string;
    options: OptionsProps[];
}