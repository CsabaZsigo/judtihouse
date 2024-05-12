
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';



export default function Header2() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className='bg-neutral-900 shadow-md p-7 '>
      <div className='flex justify-center bg-red-600 rounded-lg'><p>Ez a honlap jelenleg fejlesztés alatt áll!</p></div>
          <div className='flex gap-5'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-stone-600'>Judit</span>
            <span className='text-red-600'>House</span>
          </h1>
        </Link>
        <Link to='/profile'>
            {currentUser ? (
              <div className=''>
               Admin menü
              </div>
            ) : (
              false // <li className=' text-slate-700 hover:underline'> Sign in</li>
              )}
          </Link>
          <Link to='/create-listing'>
            {currentUser ? (
              <div className=''>
               Hirdetés létrehozása
              </div>
            ) : false
          }
          </Link>
          <Link to='/customer'>
            {currentUser ? (
              <div className=''>
               Ügyfelek
              </div>
            ) : false
          }
          </Link>

              </div>


    </header>
  );
}