import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/pagination';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
                  <div className='flex flex-col max-w-6xl mx-auto p-3 my-7 gap-4'>
        <div >
          <Swiper setWrapperSize className='max-h-6xl'  Pagination navigation >
            {listing.imageUrls.map((url) => (
              <SwiperSlide className='flex justify-center h-[60vh]' injectStylesUrls={url} key={url}> 
                <Link to={`${url}`} target={'_blank'}>
                <img className='scale-125' src={url} alt="A hirdetés képe" />
                </Link>
                {/* <div
                  className='h-[550px] max-w-6xl'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  ></div> */}
                                
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 text-gray-900 p-2'>
              Hivatkozás kimásolva
            </p>
          )}

            <p className='text-2xl font-semibold'>
              {listing.name} <br /> {' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('hu-HU')
                : listing.regularPrice.toLocaleString('hu-HU')}
              {listing.type === 'rent' && ' / month'}
              {' '} Forint
            </p>
            <ul className='text-green-600 font-semibold text-xl flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.rooms} szoba `
                  : `${listing.rooms} szoba `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} fürdőszoba `
                  : `${listing.bathrooms} fürdőszoba `}
              </li>
              {/* <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li> */}
            </ul>
            <p className='flex items-center mt-6 gap-2 text-slate-200 font-bold  text-2xl'>
              <FaMapMarkerAlt className='text-green-600' />
              {listing.city}
            </p>

            <p className=' whitespace-pre-line text-slate-200 text-xl'>
                            {listing.description}.text
            </p>

            {/* {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )} */}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}