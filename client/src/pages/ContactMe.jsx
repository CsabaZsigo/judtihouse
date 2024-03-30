import React from 'react'

export default function ContactMe() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>Kapcsolatfelvétel</h1>
      <p className='mb-4 text-slate-200'>Személyesen irodámban, illetve telefonon, e-mail üzenetben.</p>
      <p className='mb-4 text-slate-200'>
      <p>
      <a className='hover:underline' href="tel:+36704535449" target="_blank">+36-70-453-5449</a>
      </p>
      <p>
      <a className='hover:underline' href="mailto:judithouse22@gmail.com" target="_blank">judithouse22@gmail.com</a>
      </p>
      <strong>Nyitvatartás: </strong> telefonos egyeztetés alapján
</p>
    </div>
  )
}