"use client";
import {useState} from 'react';
import Image from 'next/image';
import { CarProps } from '@/types';
import { CustomButton, CardDetails} from '.';
import { calculateCarRent, generateCarImageUrl } from '@/utils';

interface CarCardProps{
    car:CarProps
}

function CarCard({car}:CarCardProps) {
  const {City_Mpg, year, make, model, transmission, drive }= car;
  const carRent = calculateCarRent(City_Mpg, year)
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className='car-card group'>
        <div className='car-card__content'>
            <h2 className='car-card__content-title'>
                {make} {model}
            </h2>
        </div>

        <p className='flex mt-6 text-[32px] font-extrabold'>
            <span className='self-start text-[14px] font-semibold'>
                NIS
            </span>
            {carRent}
            <span className='self-end text-[14px] font-medium'>
                /day
            </span>
        </p>

        <div className='relative w-full h-40 my-3 object-contain'>
            <Image src={generateCarImageUrl(car)} alt="car model" fill priority className="object-contain" />
        </div>

        <div className='relative flex w-full mt-2'>
        <div className='flex group-hover:invisible w-full justify-between text-grey'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image src='/steering-wheel.svg' width={20} height={20} alt='steering wheel' />
            <p className='text-[14px] leading-[17px]'>
              {transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{drive ? drive.toUpperCase() : 'N/A'}</p>
          </div>
          <div className="car-card__icon">
            <Image src="/gas.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{City_Mpg} MPG</p>
          </div>
        </div>

        <div className="car-card__btn-container">
          <CustomButton
            title='View More'
            containerStyles='w-full py-[16px] rounded-full bg-black text-white text-[14px] leading-[17px] font-bold'
            rightIcon='/right-arrow.svg'
            handleClick={() => setIsOpen(true)}
          />
        </div>
        </div>
        <CardDetails isOpen={isOpen} closeModel={()=> setIsOpen(false)} car={car}/>
    </div>
  )
}

export default CarCard