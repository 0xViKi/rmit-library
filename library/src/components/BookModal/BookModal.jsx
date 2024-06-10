import React from 'react';
import { Modal, CardMedia, Typography, Box, Card, CardContent } from '@mui/material';

const BookModal = ({ book, onClose }) => {
    const { title, author, description, publicationLocation, image, isbn } = book;

    return (
        <>
            <Modal open={true} onClose={onClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0)'}}>
                <Card sx={{ display: 'flex',
                     background: "rgba(255, 255, 255, 0.8)",
                     backdropFilter: 'blur(10px)',
                     borderRadius: '10px',
                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                     padding: 2,
                     width: '600px',
                     height: '300px',
                 }}>
                    <CardMedia component="img" image={image} alt={title} sx={{ width: 200 }} />
                    <CardContent>
                    <Box sx={{height: '18px'}}/>
                    <Typography variant="h6" component="div"  >{title}</Typography>
                    <Box sx={{height: '10px'}}/>
                    <Typography variant="body1" color="text.secondary" ><strong>Author:</strong> {author}</Typography>
                    <Box sx={{height: '10px'}}/>
                    <Typography variant="body1" color="text.secondary" ><strong>ISBN:</strong> {isbn}</Typography>
                    <Box sx={{height: '10px'}}/>
                    <Typography variant="body1" color="text.secondary" ><strong>Publication Location:</strong> {publicationLocation}</Typography>
                    <Box sx={{height: '10px'}}/>
                    <Typography variant="body1" color="text.secondary" ><strong>Description: </strong>  {description}</Typography>
                    {/* <Typography variant="body1" >{description}</Typography> */}
                    {/* Add more details as needed */}
                    </CardContent>
                </Card>
                </Box>
            </Modal>
        </>
        
    )
}

export default BookModal;