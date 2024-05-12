import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Customer() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    basebuildingAreaDropdown: 'bigger',
    basebuildingArea: '',
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const cityFromUrl = urlParams.get('city');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const buldingAreaFromUrl = urlParams.get('basebuildingArea');
    const basebuildingAreaDropdownFromUrl = urlParams.get('basebuildingAreaDropdown')
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      cityFromUrl ||
      typeFromUrl ||
      buldingAreaFromUrl ||
      basebuildingAreaDropdownFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        city: cityFromUrl || '',
        type: typeFromUrl || 'all',
        basebuildingArea: buldingAreaFromUrl || '',
        basebuildingAreaDropDown: basebuildingAreaDropdownFromUrl || 'bigger',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === 'city') {
      setSidebardata({ ...sidebardata, city: e.target.value });
    }

    
    if (e.target.id === 'basebuildingAreaDropdown') {
      setSidebardata({ ...sidebardata, basebuildingAreaDropdown: e.target.value });
    }

    
    if (e.target.id === 'basebuildingArea') {
      setSidebardata({ ...sidebardata, basebuildingArea: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('city', sidebardata.city);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('basebuildingAreaDropdown', sidebardata.basebuildingAreaDropdown),
    urlParams.set('basebuildingArea', sidebardata.basebuildingArea),
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    console.log(searchQuery);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row '>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='text-slate-800 flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap text-slate-200 font-semibold'>
              Hirdetés címe
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap text-slate-200 font-semibold'>
              Város:
            </label>
            <input
              type='text'
              id='city'
              placeholder='Search...'
              defaultValue={''}
              className='border rounded-lg p-3 w-full'
              value={sidebardata.city}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2 text-slate-800'>
            <label className='font-semibold text-slate-200'>Alapterület:</label>
            <select
              onChange={handleChange}
              defaultValue={'bigger'}
              id='basebuildingAreaDropdown'
              className='border rounded-lg p-3'
            >
              <option value='smaller'>Kisebb mint</option>
              <option value='bigger'>Nagyobb mint</option>
            </select>
            <input
              type='number'
              id='basebuildingArea'
              placeholder='alapterület'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.basebuildingArea}
              onChange={handleChange}
            />
          </div>
          
          <div className='flex gap-2 flex-wrap text-slate-200 items-center'>
            <label className='font-semibold '>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Kidaó és Eladó</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Kiadó</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Eladó</span>
            </div>
            {/* <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div> */}
          </div>
          {/* <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold text-slate-200'>Kényelmi szolgáltatások:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div> */}
          <div className='flex items-center gap-2 text-slate-800'>
            <label className='font-semibold text-slate-200'>Listázás:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Ár szerint csökkenő</option>
              <option value='regularPrice_asc'>Ár szerint növekvő</option>
              <option value='createdAt_desc'>Legfrisebb</option>
              <option value='createdAt_asc'>Legrégebbi</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Keresés
          </button>
          <Link to={"/create-customer"} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 flex justify-center'>
            <span>Ügyfél létrehozása</span>
          </Link>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-200 mt-5'>
          A keresés eredményei:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}