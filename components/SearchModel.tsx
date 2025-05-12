'use client';
import { useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import Image from 'next/image';

interface SearchModelProps {
  model: string;
  setModel: (model: string) => void;
  models: string[];
}

function SearchModel({ model, setModel, models }: SearchModelProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredModels =
    query === ''
      ? models
      : models.filter((item) =>
          item.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className='search-manufacturer'>
      <Combobox
        value={model}
        onChange={(value) => {
          setModel(value);
          setIsOpen(false);
        }}
      >
        <div className='relative w-full'>
          <Combobox.Button
            className='absolute top-[14px]'
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <Image
              src='/model_icon.svg'
              width={20}
              height={20}
              className='ml-4'
              alt='model icon'
            />
          </Combobox.Button>
          
          <Combobox.Input
            className='search-manufacturer__input'// dsf
            placeholder='Mercedes'
            displayValue={(value: string) => value}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setIsOpen(true)}
          />

          <Transition
            as={Fragment}
            show={isOpen}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => {
              setQuery('');
              setIsOpen(false);
            }}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredModels.length === 0 && query !== '' ? (
                <Combobox.Option value={query} className='search-manufacturer__option'> //need to update
                  Create '{query}'
                </Combobox.Option>
              ) : (
                filteredModels.map((item) => (
                  <Combobox.Option
                    key={item}
                    className={({ active }) =>
                      `relative search-manufacturer__option ${active ? 'bg-black text-white' : 'text-gray-900'}`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                     <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-pribg-primary-purple'
                            }`}
                          ></span>
                        )}
                      </>)}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default SearchModel;
