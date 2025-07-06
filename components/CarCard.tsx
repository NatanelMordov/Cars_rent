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
  const {fuels, yearsOfProduction, manufacturers, model, gear, priceperday, averageRating = 0 }= car;
  const [isOpen, setIsOpen] = useState(false);
const numericRating = Number(car.averageRating ?? 0);
  
  // func to present the stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ color: i <= averageRating ? '#FFD700' : '#d3d3d3', fontSize: '20px', marginRight: '2px' }}
          aria-label={i <= averageRating ? "Filled star" : "Empty star"}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  
  return (
    <div className='car-card group'>
        <div className='car-card__content'>
            <h2 className='car-card__content-title'>
                {manufacturers} {model}
            </h2>
        </div>
        
        <div className="rating mt-2">
          {renderStars()}
          <span className="ml-2 text-sm text-gray-600">
            {numericRating > 0 ? `(${numericRating.toFixed(1)})` : "Not yet rated"}
          </span>
        </div>

        <p className='flex mt-6 text-[32px] font-extrabold'>
            <span className='self-start text-[14px] font-semibold'>
                NIS
            </span>
            {priceperday}
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
              {gear}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{yearsOfProduction}</p>
          </div>
          <div className="car-card__icon">
            <Image src="/gas.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{fuels}</p>
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