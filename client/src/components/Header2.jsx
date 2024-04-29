
import { Link, useNavigate } from 'react-router-dom';


export default function Header2() {
  return (
    <header className='bg-neutral-900 shadow-md p-7'>
      <div className='flex justify-center bg-red-600 rounded-lg'><p>Ez a honlap jelenleg fejlesztés alatt áll!</p></div>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-stone-600'>Judit</span>
            <span className='text-red-600'>House</span>
          </h1>
        </Link>


    </header>
  );
}