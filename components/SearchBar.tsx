"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchManufactur from './SearchManufactur';
import SearchModel from './SearchModel';
import Image from 'next/image';

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type='submit' className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src={'/magnifying-glass.svg'}
      alt={'magnifying glass'}
      width={40}
      height={40}
      className='object-contain'
    />
  </button>
);

function SearchBar() {
  const [manufactur, setManufactur] = useState('');
  const [model, setModel] = useState('');
  const [manufacturersList, setManufacturersList] = useState<string[]>([]);
  const [modelsList, setModelsList] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/manufacturers')
      .then((res) => res.json())
      .then((data) => setManufacturersList(data))
      .catch((err) => console.error('Failed to fetch manufacturers:', err));
  }, []);

  useEffect(() => {
  if (!manufactur){
    setModel('');
    return;
  } 

  fetch(`http://localhost:5000/models?manufacturer=${manufactur}`)
    .then((res) => res.json())
    .then((data) => {
      setModelsList(data);
      setModel('');
    })
    .catch((err) => console.error('Failed to fetch models:', err));
}, [manufactur]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (manufactur === '' && model === '') {
      return alert('Please fill in the search bar');
    }
    updateSearchParams(model.toLowerCase(), manufactur.toLowerCase());
  };

  const updateSearchParams = (model: string, manufactur: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (model) {
      searchParams.set('model', model);
    } else {
      searchParams.delete('model');
    }

    if (manufactur) {
      searchParams.set('manufactur', manufactur);
    } else {
      searchParams.delete('manufactur');
    }

    const newPathName = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newPathName);
  };

  return (
    <form className='searchbar' onSubmit={handleSearch}>
      <div className='searchbar__item'>
        <SearchManufactur
          manufactur={manufactur}
          setManufactur={setManufactur}
          manufacturers={manufacturersList}
        />
        <SearchButton otherClasses='sm:hidden' />
      </div>
     {manufactur && ( <div className='searchbar__item'>
      <SearchModel model={model} setModel={setModel} models={modelsList} />
        <SearchButton otherClasses='sm:hidden' />
      </div>
      )}
      <SearchButton otherClasses='max-sm:hidden' />
    </form>
  );
}

export default SearchBar;