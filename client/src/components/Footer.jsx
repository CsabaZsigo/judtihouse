import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className='fixed bottom-0 w-full'>
        <div className='flex justify-between items-center mx-auto p-3 bg-gray-500 shadow-md'>
            <p>Készítette: Zsigó Csaba</p>
            <Link to={'/tnc'}>Adatkezelési szabályzat</Link>
        </div>
    </div>
  )
}