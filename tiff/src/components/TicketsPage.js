import React from 'react';
import Container from '@material-ui/core/Container';
import Ticket from './Ticket.js'

const tickets = [
    {
        name: 'Newcomer',
        price: 468,
        description: '5-day access, can participate at 3 events at most in a single day.'
    },
    {
        name: 'Seasoned',
        price: 700,
        description: 'Full access, can participate at 3 events at most in a single day.'
    },
    {
        name: 'Premium',
        price: 900,
        description: 'Full access to all festivall events.'
    },
]

export default function TicketsPage(props) {

    return (
        <Container align='center'>
            {tickets.map((ticket) => 
                <Ticket ticket={ticket}/>
            )}
        </Container>
    )
}