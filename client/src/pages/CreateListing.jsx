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

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
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
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 16) { // here we declare the maximum amount if images to a single listing
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 15 images per listing');
      setUploading(false);
    }
  };

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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
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
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
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
      <h1 className='text-slate-200 text-3xl font-semibold text-center my-7'>
      Új ingatlan felvitele
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 bg-slate-500 p-5 rounded'>

        <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Elhelyezkedés</h1>
          <div className='flex items-center gap-2 flex-wrap'>
              <input
                type='text'
                id='city'
                placeholder='Irányítószám, település'
                maxLength='62'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.city}
              />


              <input
                type='text'
                id='street'
                maxLength='62'
                placeholder='Közterület neve'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.street}
              />

              <p>Közterület típusa</p>
              <select type='dropdown' id='streetType' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.streetType}>      
                <option value="utca">utca</option>
                <option value="út">út</option>
                <option value="tér">tér</option>
                <option value="tere">tere</option>
                <option value="lakótelep">lakótelep</option>
                <option value="lakónegyed">lakónegyed</option>
                <option value="körút">körút</option>
                <option value="köz">köz</option>
                <option value="rakpart">rakpart</option>
                <option value="sétány">sétány</option>
                <option value="dűlő">dűlő</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="10f">10 felett</option>
                <option value="teto">Tetőtér</option>
              </select>

              <input
            type='number'
            placeholder='Házszám'
            className='border p-3 rounded-lg'
            id='houseNumber'
            maxLength='10'
            required
            onChange={handleChange}
            value={formData.houseNumber}
          />
              <p>Emelet</p>
              <select type='dropdown' id='level' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.level}>      
                <option value="szuteren">Szuterén</option>
                <option value="foldszint">Földszint</option>
                <option value="felemelet">Félemelet</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="10f">10 felett</option>
                <option value="teto">Tetőtér</option>
              </select>

              <input
            type='text'
            placeholder='Ajtó'
            className='border p-3 rounded-lg'
            id='door'
            maxLength='10'
            onChange={handleChange}
            value={formData.door}
          />

            <p>Nyilvános</p>
              <select type='dropdown' id='cityType' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.cityType}>      
                <option value="Megye">Megye</option>
                <option value="Kistérség">Kistérség</option>
                <option value="Település">Település</option>
                <option value="Utca">Utca</option>
              </select>

              <input
                type='text'
                id='hrsz'
                maxLength='62'
                placeholder='Helyrajzi szám'
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.hrsz}
              />
            </div>

            <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Alapinformációk</h1>
            <div class="flex items-center gap-2 flex-wrap">            
            <p>Típus</p>
            <select type='dropdown' id='baseType' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.baseType}>  
              <optgroup label="lakás">
                <option value="panel lakás">panel lakás</option>
                <option value="tégla lakás">tégla lakás</option>
              </optgroup>    
              <optgroup label="ház">
                <option value="panel lakás">családi ház</option>
                <option value="tanya">tanya</option>
                <option value="parasztházs">parasztház</option>
                <option value="sorház">sorház</option>
                <option value="házrész">házrész</option>
                <option value="ikerház">ikerház</option>
              </optgroup>
              <optgroup label="telek">
                <option value="építési telek">építési telek</option>
                <option value="üdülőövezeti telek">üdülőövezeti telek</option>
                <option value="külterületi telek">külterületi telek</option>
                <option value="egyéb telek">egyéb telek</option>
              </optgroup>
              <optgroup label="nyaraló">
                <option value="üdülő">üdülő</option>
                <option value="zártkert">zártkert</option>
                <option value="üdülési jog">üdülési jog</option>
              </optgroup>
              <optgroup label="garázs">
                <option value="egyedi garázs">egyedi garázs</option>
                <option value="teremgarázs">teremgarázs</option>
                <option value="parkolóhely">parkolóhely</option>
              </optgroup>
              <optgroup label="luxus ingatlan">
                <option value="kastély, kúria">kastély, kúria</option>
                <option value="luxus villa">luxus villa</option>
                <option value="luxus lakás">luxus lakás</option>
              </optgroup>
              <optgroup label="üzleti ingatlan">
                <option value="mezőgazdasági">mezőgazdasági</option>
                <option value="egyéb">egyéb</option>
                <option value="iroda">iroda</option>
                <option value="kereskedelmi">kereskedelmi</option>
                <option value="ipari ingatlan">ipari ingatlan</option>
                <option value="bérlemény">bérlemény</option>
                <option value="vendeglátó egység">vendeglátó egység</option>
              </optgroup>
              </select>
              <p>Épület</p>
              <input
            type='number'
            placeholder='Épület'
            className='border p-3 rounded-lg max-w-24'
            id='buildingArea'
            min='1'
            required
            onChange={handleChange}
            value={formData.buildingArea}
          />
          <p>m<sup>2</sup></p>
            <p>Telek</p>
          <input
            type='number'
            placeholder='Telek'
            className='border p-3 rounded-lg max-w-24'
            id='plotArea'
            min='1'
            required
            onChange={handleChange}
            value={formData.plotArea}
          />
          <p>m<sup>2</sup></p>

          <p>Szobák</p>
              <input
            type='number'
            placeholder='Szoba'
            className='border p-3 rounded-lg max-w-24'
            id='rooms'
            min='1'
            required
            onChange={handleChange}
            value={formData.rooms}
          />

            <p>Félszobák</p>
          <input
            type='number'
            placeholder='Félszoba'
            className='border p-3 rounded-lg max-w-24'
            id='halfRooms'
            min='1'
            onChange={handleChange}
            value={formData.halfRooms}
          />


          <p>Fürdő</p>
          <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />


              <p>Szintek</p>
              <input
                type='number'
                id='levels'
                min='1'
                max='100'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.levels}
              />

            <p>Fűtés</p>
              <select type='dropdown' id='heating' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.heating}>      
                <option value="nem ismert">nem ismert</option>
                <option value="gáz (cirkó)">gáz (cirkó)</option>
                <option value="gáz (héra)">gáz (héra)</option>
                <option value="gáz (konvektor)">gáz (konvektor)</option>
                <option value="gáz (kazán)">gáz (kazán)</option>
                <option value="egyéb kazán">egyéb kazán</option>
                <option value="távfűtés">távfűtés</option>
                <option value="elektromos">elektromos</option>
                <option value="házközponti">házközponti</option>
                <option value="házközponti egyedi méréssel">házközponti egyedi méréssel</option>
                <option value="fan-coil">fan-coil</option>
                <option value="egyedi">egyedi</option>
              </select>

              <p>Állag</p>
              <select type='dropdown' id='status' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.status}>      
                <option value="újépítésű">újépítésű</option>
                <option value="újszerű">újszerű</option>
                <option value="felújított">felújított</option>
                <option value="átlagos">átlagos</option>
                <option value="felújítandó">felújítandó</option>
                <option value="befejezetlen">befejezetlen</option>
                <option value="bontandó">bontandó</option>
              </select>

              <p>Építés éve</p>
              <input
                type='number'
                id='year'
                min='1800'
                max='2100'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.year}
              />
              </div>
              <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Tulajdonos</h1>
              <div class="flex items-center gap-2 flex-wrap">
                  <input
                    type='text'
                    placeholder='Tulajdonos neve'
                    className='border p-3 rounded-lg'
                    id='ownerName'
                    maxLength='62'
                    minLength='3'
                    required
                    onChange={handleChange}
                    value={formData.ownerName}
                  />

                  <input
                    type='text'
                    placeholder='Cégnév'
                    className='border p-3 rounded-lg'
                    id='companyName'
                    maxLength='62'
                    minLength='10'
                    onChange={handleChange}
                    value={formData.companyName}
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
                  <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Eladás</h1>
                  <div className='flex-row flex gap-2 max-h-6'>
                  <div className='flex gap-2'>
              <input
                type='radio'
                id='sale'
                name='radioSale'
                className='w-5'
                onChange={handleChange}
                // checked={formData.type === 'sale'}
              />
              <span>Eladás</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='radio'
                id='rent'
                name='radioSale'
                className='w-5'
                onChange={handleChange}
                // checked={formData.type === 'rent'}
              />
              <span>Bérbeadás</span>
                  </div>
            
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Akció</span>
              {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Akciós ár</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>(Forint / hónap)</span>
                  )}
                </div>
              </div>
            )}

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
              <div className='flex flex-col items-center'>
                <p>Irányár</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(Forint / hónap)</span>
                )}
              </div>
            </div>
            </div>
            </div>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Főcím'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Leírás'
            className='border p-3 rounded-lg'
            id='description'
            rows="10"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <div className='flex gap-2 flex-wrap'>
            
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offset'
                className='w-5'
                onChange={handleChange}
                checked={formData.offset}
              />
              <span>lakás beszámítással</span>
            </div>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='immediateMove'
                className='w-5'
                onChange={handleChange}
                checked={formData.immediateMove}
              />
              <span>azonnal költözhető</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='customHeating'
                className='w-5'
                onChange={handleChange}
                checked={formData.customHeating}
              />
              <span>egyedi fűtés (lakás)</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='lowUpkeep'
                className='w-5'
                onChange={handleChange}
                checked={formData.lowUpkeep}
              />
              <span>alacsony rezsi (lakás)</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='goodLayout'
                className='w-5'
                onChange={handleChange}
                checked={formData.goodLayout}
              />
              <span>jó elrendezésű</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='goodTransportation'
                className='w-5'
                onChange={handleChange}
                checked={formData.goodTransportation}
              />
              <span>jó közlekedés</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='nearMetro'
                className='w-5'
                onChange={handleChange}
                checked={formData.nearMetro}
              />
              <span>metróközeli</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='panorama'
                className='w-5'
                onChange={handleChange}
                checked={formData.panorama}
              />
              <span>panorámás</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='nearWater'
                className='w-5'
                onChange={handleChange}
                checked={formData.nearWater}
              />
              <span>vízközeli</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='onBeach'
                className='w-5'
                onChange={handleChange}
                checked={formData.onBeach}
              />
              <span>vízparti</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='balcony'
                className='w-5'
                onChange={handleChange}
                checked={formData.balcony}
              />
              <span>erkélyes</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='gallery'
                className='w-5'
                onChange={handleChange}
                checked={formData.gallery}
              />
              <span>galériás</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='galleryAble'
                className='w-5'
                onChange={handleChange}
                checked={formData.galleryAble}
              />
              <span>gallériázható</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='elevator'
                className='w-5'
                onChange={handleChange}
                checked={formData.elevator}
              />
              <span>liftes</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='onGarden'
                className='w-5'
                onChange={handleChange}
                checked={formData.onGarden}
              />
              <span>udvari (lakás)</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='onStreet'
                className='w-5'
                onChange={handleChange}
                checked={formData.onStreet}
              />
              <span>utcai (lakás)</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='doubleGarage'
                className='w-5'
                onChange={handleChange}
                checked={formData.doubleGarage}
              />
              <span>dupla garázs</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='garage'
                className='w-5'
                onChange={handleChange}
                checked={formData.garage}
              />
              <span>garázs</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='driveway'
                className='w-5'
                onChange={handleChange}
                checked={formData.driveway}
              />
              <span>kocsibeálló</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='americanKitchen'
                className='w-5'
                onChange={handleChange}
                checked={formData.americanKitchen}
              />
              <span>amerikai konyha</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='fireplace'
                className='w-5'
                onChange={handleChange}
                checked={formData.fireplace}
              />
              <span>kandalló</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='aircondicioned'
                className='w-5'
                onChange={handleChange}
                checked={formData.aircondicioned}
              />
              <span>légkondicionált</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='gardenPark'
                className='w-5'
                onChange={handleChange}
                checked={formData.gardenPark}
              />
              <span>parkosított kert</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='quiet'
                className='w-5'
                onChange={handleChange}
                checked={formData.quiet}
              />
              <span>csendes</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='light'
                className='w-5'
                onChange={handleChange}
                checked={formData.light}
              />
              <span>világos</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='alarm'
                className='w-5'
                onChange={handleChange}
                checked={formData.alarm}
              />
              <span>riasztó</span>
            </div>
          </div>
          </div>
          <div className='flex flex-wrap gap-6'>
          </div>

          <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Motiváció</h1>
               <div className='flex items-center gap-2 flex-wrap'>
                <p>Az eladás oka:</p>
                  <select type='dropdown' id='sellCause' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.sellCause}>      
                    <option value="Kiváncsi rá mennyiért tudná eladni.">Kiváncsi rá mennyiért tudná eladni.</option>
                    <option value="Nem tudja fizteni a hitelt, el kell adnia.">Nem tudja fizteni a hitelt, el kell adnia.</option>
                    <option value="Sürgősen készpénzre van szüksége, el kell adnia">Sürgősen készpénzre van szüksége, el kell adnia.</option>
                    <option value="Örökölte, el akarja adni.">Örökölte, el akarja adni.</option>
                    <option value="Válás, szétköltözés miatt el akarja adni.">Válás, szétköltözés miatt el akarja adni.</option>
                    <option value="Összeköltözés miatt el akarja adni.">Összeköltözés miatt el akarja adni.</option>
                    <option value="Munkahely váltás miattt el kell költöznie.">Munkahely váltás miattt el kell költöznie.</option>
                    <option value="Küföldre költözik.">Küföldre költözik.</option>
                    <option value="Nagyobb ingatlanba akar költözni.">Nagyobb ingatlanba akar költözni.</option>
                    <option value="Kisebb ingatlanba akar költözni">Kisebb ingatlanba akar költözni.</option>
                    <option value="Komfortosabb, jobb állapotú ingatlanba akar költözni.">Komfortosabb, jobb állapotú ingatlanba akar költözni.</option>
                    <option value="Jobb környékre akar költözni.">Jobb környékre akar költözni.</option>
                    <option value="Lakásból családi házba akar költözni.">Lakásból családi házba akar költözni.</option>
                    <option value="Családi házból lakásba akar költözni.">Családi házból lakásba akar költözni.</option>
                    <option value="Városból vidékre akar költözni.">Városból vidékre akar költözni.</option>
                    <option value="Vidékről városba akar költözni.">Vidékről városba akar költözni.</option>
                    <option value="Új ingatlant vett, épített a régit el akarja adni">Új ingatlant vett, épített a régit el akarja adni</option>
                    <option value="Befektetésnek vette, pénzéhez akar jutni.">Befektetésnek vette, pénzéhez akar jutni.</option>
              </select>

              <p>Eddig el kell adnia</p>
                  <input
                      type='date'
                      className='border p-3 rounded-lg'
                      id='sellUntil'
                      maxLength='10'
                      required
                      onChange={handleChange}
                      value={formData.sellUntil}
                    />
                  <p>Minimum szükséges készpénz</p>
                  <input
                      type='number'
                      className='border p-3 rounded-lg'
                      id='minCash'
                      required
                      onChange={handleChange}
                      value={formData.minCash}
                    />

                    <p>Eladhatóság</p>
                    <select type='dropdown' id='sellability' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.sellability}>      
                      <option value="minimális">minimális</option>
                      <option value="⭐">⭐</option>
                      <option value="⭐⭐">⭐⭐</option>
                    </select>
                  </div>
                  <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>A megbízás</h1>
               <div className='flex items-center gap-2 flex-wrap'>
                <p>Szerződés/megbízás típusa</p>
               <select type='dropdown' id='contract' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.contract}>      
                      <option value="Nincs">Nincs</option>
                      <option value="Szóbeli">Szóbeli</option>
                      <option value="Nem kizárólagos">Nem kizárólagos</option>
                      <option value="Fél kizárólagos">Fél kizárólagos</option>
                      <option value="Kizárólagos">Kizárólagos</option>
                      <option value="Társirodai">Társirodai</option>
                      <option value="Hirdetés">Hirdetés</option>
                      <option value="Egyéb">Egyéb</option>
                      <option value="Banki">Banki</option>
                      <option value="Garanciális">Garanciális</option>
                      <option value="Kiemelt">Kiemelt</option>
                    </select>

                    <p>jutalék</p>
                    <input
                      type='number'
                      className='border p-3 rounded-lg max-w-16'
                      step='0.1'
                      id='commissionPercent'
                      onChange={handleChange}
                      value={formData.commissionPercent}
                    />
                    <span>% vagy fix</span>
                    <input
                      type='number'
                      className='border p-3 rounded-lg max-w-28'
                      id='commission'
                      onChange={handleChange}
                      value={formData.commission}
                    />
                    <p>kiadható cím</p>

              <input
                type='checkbox'
                id='sendOutAddress'
                className='w-10'
                onChange={handleChange}
                checked={formData.sendOutAddress}
                />
                </div>
              
                <h1 className='bg-slate-400 rounded-lg p-1 mb-1 font-medium'>Az ingatlant terhelő jelzáloghitel és értékbecslés</h1>
                <p>Jelzáloghitel terhelés</p>
               <div className='flex items-center gap-2 flex-wrap'>
                <select type='dropdown' id='loan' className='p-3 border border-gray-300 rounded-lg' onChange={handleSelect}   value={formData.loan}>      
                      <option value="Nem ismert">Nem ismert</option>
                      <option value="Van">Van</option>
                      <option value="Nincs">Nincs</option>
                </select>
                <p>Tőkeösszeg</p>
                <input
                      type='number'
                      className='border p-3 rounded-lg max-w-28'
                      id='capitalAmmount'
                      min='0'
                      onChange={handleChange}
                      value={formData.capitalAmmount}
                    />
                    <span>Ft</span>

                    <p>Bank neve</p>
                    <input
                      type='number'
                      min='0'
                      className='border p-3 rounded-lg max-w-28'
                      id='bankName'
                      onChange={handleChange}
                      value={formData.bankName}
                    />

                <p>Értékbecslő által megállapított menekülési érték</p>
                    <input
                      type='number'
                      className='border p-3 rounded-lg max-w-28'
                      min='0'
                      id='estimatedValue'
                      onChange={handleChange}
                      value={formData.estimatedValue}
                    />

                </div>
        
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Képek:
            <span className='font-normal text-gray-600 ml-2'>
             Az első feltölött kép kerül beállításra listázási képként (max 15)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 mb-10 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>


      </form>
    </main>
  );
}