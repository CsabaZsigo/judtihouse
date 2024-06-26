import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <p className='text-slate-400 p-7 pb-1 text-3xl'>Pittner Györgyné Judit</p>
      <div className='flex'>
      <img className='flex-initial w-1/5 object-cover ' src="https://github.com/CsabaZsigo/judtihouse/blob/main/client/src/assets/images/profile.jpg?raw=true" alt="Judit profilkép" />
      <img className='flex-initial w-4/5 ' src="https://raw.githubusercontent.com/CsabaZsigo/judtihouse/main/client/src/assets/images/logo.webp" alt="JuditHouse Logo" />
      </div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-red-700 font-bold text-3xl lg:text-6xl'>
          Találjuk meg közösen új otthonát!
         
        </h1>
        <div className=' text-3xl text-gray-100 '>
          <Link to="/about"
          className='font-bold hover:underline'>
          Várom hívását, hogy segíthessek!
          </Link>
        </div>
        <ul className="text-2xl	place-content-evenly flex items-center flex-col md:flex-row md:gap-3">
       
          <Link to='/about'>
            <li className=' sm:inline text-slate-200 hover:underline'>
              Magamról
            </li>
          </Link>
          <Link to='/contactme'>
          <li className=' sm:inline text-slate-200 hover:underline'>
              Kapcsolatfelvétel
            </li>
          </Link>
          
          <Link to={'/tnc'}>
            <li className='sm:inline text-slate-200 hover:underline'>
            Adatkezelési szabályzat
            </li>
            </Link>
          
          {/* <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              false // <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link> */}
        </ul>
        <div className='relative'>
        <img className='w-full' src="https://github.com/CsabaZsigo/judtihouse/blob/main/client/src/assets/images/house.jpg?raw=true" alt="Fénykép egy modern házról" />
          <Link className='absolute text-4xl top-2/3 left-1/4 bg-slate-500 text-slate-200 p-4 rounded-lg hover:bg-blue-800 m-2' to={'/'}>
            Ingatlanok
          </Link>
        </div>

        
      </div>

{/*       
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <Link to={`/listing/${listing._id}`} target="_blank">
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
              </Link>
              <style>{`
        .swiper-button-prev, .swiper-button-next{


        }
        `}</style>
            </SwiperSlide>
          ))}
      </Swiper> */}



      {/* listing results for offer, sale and rent */}

      {/* <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}