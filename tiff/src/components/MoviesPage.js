import React, { useState, useEffect } from 'react';
import ErrorPage from './ErrorPage.js'
import ListOfMovies from './ListOfMovies.js'

export default function MoviesPage() {
  const [page, setPage] = useState('')

  useEffect(async () => {
    const axios = require('axios')

    axios({
        method: 'get',
        url: 'http://localhost:5000/movies',
    }).then(res => {
        setPage(<ListOfMovies props={res.data.response} />)
    }).catch(e => {
        setPage(<ErrorPage/>)
    });
}, [0]);

    return (
    <>
        {page}
    </>
    )
}