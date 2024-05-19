import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateCustomer() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({           //Form data initialize
    imageUrls: [],
    name: '',
    description: '',
    level: 'foldszint',
    city: '',
    street: '',
    streetType: 'út',
    houseNumber: '',
    door: '',
    cityType: 'Település',
    hrsz: '',
    rooms: 1,
    halfRooms: '',
    bathrooms: 1,
    levels: 1,
    heating: 'nem ismert',
    status: 'átlagos',
    year: '2000',
    ownerName: '',
    companyName: '',
    phone: '',
    email: '',
    ownerCity: '',
    ownerStreet: '',
    baseType: 'bérlemény',
    buildingArea: '',
    plotArea: '',
    type: 'sale',
    regularPrice: 10000000,
    discountPrice: 0,
    offer: false,
    offset: false,
    immediateMove: false, //this is where its already done
    customHeating: false, 
    lowUpkeep: false,
    goodLayout: false,
    goodTransportation: false,
    nearMetro: false,
    panorama: false,
    nearWater: false,
    onBeach: false,
    balcony: false,
    gallery: false,
    galleryAble: false,
    elevator: false,
    onGarden: false,
    onStreet: false,
    doubleGarage: false,
    garage: false,
    driveway: false,
    americanKitchen: false,
    fireplace: false,
    aircondicioned: false,
    gardenPark: false,
    quiet: false,
    light: false,
    alarm: false,
    sendOutAddress: false,
    sellCause: 'Komfortosabb, jobb állapotú ingatlanba akar költözni.',
    sellUntil: '',
    minCash: 0,
    sellability: 'minimális',
    contract: 'Nincs',
    commissionPercent: 2.5,
    commission: 0,
    loan: 'Nem ismert',
    capitalAmmount: '',
    bankName: '',
    estimatedValue: 0,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
 

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };



  function handleSelect(event) {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value
    })
  }
  const handleChange = (e) => {
    if (e.target.type === 'radio') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.type === 'checkbox'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }


    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea' ||
      e.target.type === 'tel' ||
      e.target.type === 'email' ||
      e.target.type === 'date'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }

  };
  return (
    <main className='p-3 max-w-5xl mx-auto text-slate-800'>
      <h1 className='text-3xl text-slate-200 font-semibold text-center my-7'>
      Új ügyfél felvitele
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-slate-500 p-5 rounded'>

              <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Személyes adatok</h1>
              <div class="flex items-center gap-2 flex-wrap">
                  <input
                    type='text'
                    placeholder='Név'
                    className='border p-3 rounded-lg'
                    id='CustomerName'
                    maxLength='62'
                    minLength='3'
                    required
                    onChange={handleChange}
                    value={formData.CustomerName}
                  />

                  <input 
                    type="tel" 
                    className='border p-3 rounded-lg'
                    id="phone"
                    name="phone"
                    placeholder="+36 30 123 4567"
                    required
                    onChange={handleChange}
                    value={formData.phone}>
                  </input>

                  <input 
                    type="tel" 
                    className='border p-3 rounded-lg'
                    id="phone2"
                    name="phone2"
                    placeholder="+36 30 123 4567"
                    
                    onChange={handleChange}
                    value={formData.phone2}>
                  </input>

                  <input 
                    type="tel" 
                    className='border p-3 rounded-lg'
                    id="phone3"
                    name="phone3"
                    placeholder="+36 30 123 4567"
                    
                    onChange={handleChange}
                    value={formData.phone3}>
                  </input>

                  <input
                    type="email"
                    placeholder='pelda@email.cim'
                    className='border p-3 rounded-lg'
                    id="email"
                    size="30"
                    required
                    onChange={handleChange}
                    value={formData.email}
                   />

                  <input
                    type='text'
                    id='ownerCity'
                    placeholder='Irányítószám, település'
                    maxLength='62'
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.ownerCity}
                  />

                  <input
                    type='text'
                    id='ownerStreet'
                    placeholder='Utca, házszám'
                    maxLength='62'
                    className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange}
                    value={formData.ownerStreet}
                  />
                  </div>
                  <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Kereslet</h1>
                  <div className='flex-row flex gap-2 max-h-6'>
                  <p>Szándék:</p>
                  <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='sale'
                  name='sale'
                  className='w-5'
                  onChange={handleChange}
                  // checked={formData.type === 'sale'}
                />
                <span>Eladás</span>
               </div>
                 <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    id='rent'
                    name='rent'
                    className='w-5'
                    onChange={handleChange}
                    // checked={formData.type === 'rent'}
                  />
                  <span>Bérbeadás</span>
                  </div>
                  <div></div>
            
          <div className='flex gap-2'>
         
          <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50000'
                max='1000000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
            </div>
            </div>
            </div>
            <div className='flex gap-2 items-center'>
            <p>Eladhatóság</p>
                    <select type='dropdown' id='sellability' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.sellability}>      
                      <option value="minimális">minimális</option>
                      <option value="⭐">⭐</option>
                      <option value="⭐⭐">⭐⭐</option>
                    </select>
              
            </div>
            <div className='flex flex-col gap-4 flex-1'>
          <p>Motiváció:</p>
          <textarea
            type='text'
            placeholder='Motiváció'
            className='border p-3 rounded-lg'
            id='description'
            rows="4"
            required
            onChange={handleChange}
            value={formData.description}
            />
            </div>
            <p>Keresési terület:</p>
            <select id="searchingRegio"
            name="searchingRegio"
            onchange={handleChange}>
                <option value="Összes megye">Összes megye</option>
                <option value="Bács-Kiskun">Bács-Kiskun</option>
                <option value="Baranya">Baranya</option>
                <option value="Békés">Békés</option>
                <option value="Borsod-Abaúj-Zemplén">Borsod-Abaúj-Zemplén</option>
                <option value="Csongrád">Csongrád</option>
                <option value="Fejér">Fejér</option>
                <option value="Győr-Moson-Sopron">Győr-Moson-Sopron</option>
                <option value="Hajdú-Bihar">Hajdú-Bihar</option>
                <option value="Heves">Heves</option>
                <option value="Jász-Nagykun-Szolnok">Jász-Nagykun-Szolnok</option>
                <option value="Komárom-Esztergom">Komárom-Esztergom</option>
                <option value="Nógrád">Nógrád</option>
                <option value="Pest">Pest</option>
                <option value="Somogy">Somogy</option>
                <option value="Szabolcs-Szatmár-Bereg">Szabolcs-Szatmár-Bereg</option>
                <option value="Tolna">Tolna</option>
                <option value="Vas">Vas</option>
                <option value="Veszprém">Veszprém</option>
                <option value="Zala">Zala</option>
                <option value="Budapest">Budapest</option>
                <option value="Balaton">Balaton</option>
                <option value="Külföld">Külföld</option>
              </select>
          <div className='flex flex-wrap gap-6'>
          </div>

        <div className='flex flex-col flex-1 gap-4'>
    
          <button
            disabled={loading || uploading}
            className='p-3 mb-10 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Létrehozás...' : 'Ügyfél létrehozása'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>


      </form>
    </main>
  );
}