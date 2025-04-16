"use client"
import React, {use, useState} from 'react';
import { useRouter } from 'next/navigation';
import SearchManufactur from './SearchManufactur';
import Image from 'next/image';

const SearchButton = ({otherClasses} : {otherClasses:string})=>(
  <button type='submit' className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src={"/magnifying-glass.svg"}
      alt={"magnifying glass"}
      width={40}
      height={40}
      className='object-contain'
    />
  </button>
)

function SearchBar() {
    const [manufactur, setManufactur] = useState('');
    const [model, setModel] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      if(manufactur === '' && model === ''){
        return alert('Please fill in the search bar');
      }
      updateSearchParams(model.toLocaleLowerCase(), manufactur.toLocaleLowerCase());
    }

    const updateSearchParams = (model: string, manufactur: string)=>{
      const searchParams = new URLSearchParams(window.location.search);

      if(model){
        searchParams.set('model' , model)
      }else{
        searchParams.delete('model')
      }
      if(manufactur){
        searchParams.set('manufactur' , manufactur)
      }else{
        searchParams.delete('manufactur')
      }

      const newPathName = `${window.location.pathname}?${searchParams.toString()}`;
      router.push(newPathName);
    }

  return (
    <form className='searchbar' onSubmit={handleSearch}>
        <div className='searchbar__item'>
            <SearchManufactur
                manufactur={manufactur}
                setManufactur={setManufactur}
            />
            <SearchButton otherClasses='sm:hidden'/>
        </div>
        <div className='searchbar__item'>
          <Image 
            src="/model_icon.svg"
            width={25}
            height={25}
            className='absolute w-[20px] h-[20px] ml-4'
            alt='car icon'
          />
          <input
            type='text'
            name='model'
            value={model}
            onChange={(e)=> setModel(e.target.value)}
            placeholder='AMG'
            className='searchbar__input'
          />
           <SearchButton otherClasses='sm:hidden'/>
        </div>
        <SearchButton otherClasses='max-sm:hidden'/>
    </form>
  )
}

export default SearchBar