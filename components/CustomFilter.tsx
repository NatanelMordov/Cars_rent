"use client";
import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';
import { CustomFilterProps } from '@/types';
import { updateSearchParams, fetchFuels, fetchYears, fetchLocations } from '@/utils';



function CustomFilter({ title }: CustomFilterProps) {
  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const router = useRouter();

 
  const loadOptions = async () => {
    if (title === 'fuel') {
      const fuels = await fetchFuels();
      setOptions(fuels);
      setSelected('Fuels');
    } else if (title === 'year') {
      const years = await fetchYears();
      setOptions(years);
      setSelected('Year');
    }else if (title === 'location') {
    const locations = await fetchLocations();
    setOptions(locations);
    setSelected('Location');
  }
  };

  useEffect(() => {
    loadOptions();
  }, [title]);

  const handleUpdateParams = (value: string) => {
    const newPathName = updateSearchParams(title, value);
    router.replace(newPathName);
  };

  return (
    <div className='w-fit'>
      <Listbox
        value={selected}
        onChange={(value: string) => {
          setSelected(value);
          handleUpdateParams(value);
        }}
      >
        <div className='relative w-fit z-10'>
          <Listbox.Button className='custom-filter__btn'>
            <span className='block truncate'>
              {selected || (title === 'fuel' ? 'Fuels' : 'Year')}
            </span>
            <Image
              src="/chevron-up-down1.svg"
              width={20}
              height={20}
              className='ml-4 object-contain'
              alt='scroll'
            />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='custom-filter__options'>
              {options.map((option) => (
                <Listbox.Option
                  key={option}
                  value={option}
                 className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-black text-white' : 'text-gray-900'}`}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {option}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default CustomFilter;
