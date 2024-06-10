import React from 'react';
import Book from '../Book/Book';
import { Grid } from '@mui/material';

const BookList = ({ books }) => {
    
    return (

        <Grid container spacing={2}  >
            {books.map((book, index) => (
                <Book 
                
                key={index} 
                title={book.title} 
                author={book.author}
                isbn={book.isbn}
                description={book.description} 
                publicationLocation={book.publication_location}
                image={book.cover_picture} 
                downloadPath={book.download_path}
                viewPath={book.view_path}
                visible={book.visible}
                 />
            ))}

        </Grid>
    )
}

export default BookList;