"use client";
import Image from 'next/image';
import {Fragment, useState, useEffect} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CarProps } from '@/types';
import { generateCarImageUrl } from '@/utils';
import { useRouter } from 'next/navigation';

interface CarDeatailsProps {
    isOpen: boolean;
    closeModel: () => void;
    car: CarProps;
}

function formatKey(key: string): string {
  
  return key
    .replace(/[_-]/g, ' ')              
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
}

function CardDetails({isOpen, closeModel, car}: CarDeatailsProps) {
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const isOutOfStock = car.inventory === 0;

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


const handleAddToCart = async () => {
  if (!username || !startDate || !endDate) return;

  const dayDiff =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
    (1000 * 60 * 60 * 24);

  const totalPrice = Math.round(dayDiff) * (car.priceperday || 100); // אפשר לשים מחיר דיפולטי אם אין

  try {
    const res = await fetch('http://localhost:5000/cart/add-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        totalprice: totalPrice,
        status: 'PENDING',
      }),
    });

    if (res.ok) {
      setShowDateModal(false);
      setShowSuccessModal(true);
    } else {
      alert('Failed to add to cart');
    }
  } catch (error) {
    console.error(error);
    alert('Error occurred');
  }
};

  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className="relative z-10" onClose={closeModel}>
            <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            >
                <div  className='fixed inset-0 bg-black bg-opacity-25'/>
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4 text-center'>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-out duration-300'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                    >
         <Dialog.Panel className='relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all flex flex-col gap-5'>
                <button
                  type='button'
                  className='absolute top-2 right-2 z-10 w-fit p-2 bg-primary-blue-100 rounded-full'
                  onClick={closeModel}
                >
                 <Image
                    src='/close.svg'
                    alt='close'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </button>
                <div className='flex-1 flex flex-col gap-3' >
                    <div className='relative w-full h-40 bg-pattern bg-cover bg-center rounded-lg'>
                       <Image src={generateCarImageUrl(car)} alt='car model' fill priority className='object-contain' />
                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-2'>
                  <h2 className='font-semibold text-xl capitalize'>
                    {car.manufacturers} {car.model}
                  </h2>
                  <div className='mt-3 flex flex-wrap gap-4'>

                    {Object.entries(car)
                      .filter(([key]) => key !== 'id' && key !== 'averageRating' && key !== 'rating_sum' && key !== 'rating_count' && (key !== 'inventory' || (typeof car.inventory === 'number' && car.inventory < 4)))
                      .map(([key, value]) => (
                        <div
                          className="flex justify-between gap-5 w-full items-center text-right"
                          key={key}
                        >
                          <h4 className="whitespace-nowrap">{formatKey(key)}</h4>
                          <div className="flex items-center gap-2">
                            <p>{key === 'inventory' && typeof value === 'number' ? (
                                value === 0 ? (
                                  <p className="text-gray-500 font-medium italic">⛔ Currently unavailable</p>
                                ) : value < 4 ? (
                                  <p className="text-red-500 font-semibold animate-pulse">
                                    Only {value} left..
                                  </p>
                                ) : (
                                  <p>{value}</p>
                                )
                              ) : (
                                <p>{value}</p>
                              )}
                            </p>
                            
                            {key === 'location' && typeof value === 'string' && (
                              <button
                                onClick={() => router.push(`/map?location=${encodeURIComponent(value)}`)}
                                className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              >
                                View on Map
                              </button>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
                {/* Add to Cart Only if user logged in */}
                {username && (
                  <div className="w-full flex justify-center pt-4">
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setShowDateModal(true)}
                      className={`px-6 py-2 rounded-xl transition font-semibold
                        ${isOutOfStock
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                )}
                  {/* תיבת בחירת תאריכים */}
                  {showDateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-20 flex justify-center items-center">
                      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl z-30">
                        <h3 className="text-lg font-semibold mb-4 text-center">Select Dates</h3>
                        <div className="flex flex-col gap-4 mb-4">
                          <label className="flex flex-col">
                            Start Date:
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="border rounded px-3 py-2 mt-1"
                            />
                          </label>
                          <label className="flex flex-col">
                            End Date:
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="border rounded px-3 py-2 mt-1"
                            />
                          </label>
                        </div>
                        <div className="flex justify-between">
                          <button
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setShowDateModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleAddToCart}
                            disabled={!startDate || !endDate}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-20 flex justify-center items-center">
                      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl z-30 text-center">
                        <h3 className="text-lg font-semibold mb-4">Added to Cart Successfully!</h3>
                        <button
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                          onClick={() => {
                            setShowSuccessModal(false);
                            router.push('/Cart');
                          }}
                        >
                          Go to Cart
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
                </Transition.Child>
            
                </div>
            </div>
            
        </Dialog>
    </Transition>
    </>
  )
}

export default CardDetails