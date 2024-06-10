import React from 'react';
import Book from '../AdminBook/AdminBook';
import { Grid } from '@mui/material';

const AdminBookList = ({ books }) => {
    
    return (

        <Grid container spacing={2}  >
            {books.map((book, index) => (
                <Book 
                
                key={index} 
                id={book.id} 
                title={book.title} 
                author={book.author}
                isbn={book.isbn}
                description={book.description} 
                publicationLocation={book.publication_location}
                image={book.cover_picture} 
                downloadPath={book.download_path}
                viewPath={book.view_path}
                isVisible={book.visible}
                 />
            ))}

        </Grid>
    )
}

export default AdminBookList;