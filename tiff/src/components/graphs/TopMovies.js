import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function TopMovies(props) {
    const [data, setData] = useState([])
    const [yKey, setYKey] = useState('likes')
    const [refresh, setRefresh] = useState(false)

    const convertData = (raw_data) => {
        let keys = Object.keys(raw_data)
        let data = []
        for (let i = 0; i < keys.length; i++) {
            data.push({ [yKey] : raw_data[keys[i]], name : keys[i]})
        }

        return data
    }

    const getDataFromServer = async (url) => {
        const axios = require('axios')

        axios({
            method: 'get',
            url: 'http://localhost:5000/data/top_movies/' + url,
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        }).then(res => {
            setData(convertData(res.data.response))
            setRefresh(!refresh)
        }).catch(e => {
            console.log(e)
        });
    }

    if (props.category === 'likes' && yKey !== 'likes') {
        setYKey('likes')
        getDataFromServer('likes')
    }

    if (props.category === 'dislikes' && yKey !== 'dislikes') {
        setYKey('dislikes')
        getDataFromServer('dislikes')
    }

    if (props.category === 'reviews' && yKey !== 'reviews') {
        setYKey('reviews')
        getDataFromServer('reviews')
    }

    useEffect(() => {
        getDataFromServer(yKey)
        setRefresh(!refresh)
    }, [yKey])

  return (
      <div style={{position: 'static', width: '50%', marginLeft: '22vw', marginTop: '5vh'}}>
      <Typography align='center' style={{fontWeight: 'bold'}}>Top Movies by {yKey}</Typography>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
        }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" type="category"/>
        <YAxis allowDecimals={false}/>
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
    </div>
  );
}


