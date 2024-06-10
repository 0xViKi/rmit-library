import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview'; 
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import BookModal from '../AdminBookModal/AdminBookModal'
import './adminbook.css'
import { toast } from 'react-toastify';

const Book = ({ id, title, author, isbn, description, publicationLocation, image, viewPath, downloadPath, isVisible }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(isVisible)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleBookVisible = async () => {
        try {
            const response = await fetch('/api/book/visible', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId: id }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to enable hidden status');
            }
    
            const data = await response.json();
            toast.success(data.message);
            setIsHidden(!isHidden)
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const handleBookNotVisible = async () => {
        try {
            const response = await fetch('/api/book/not-visible', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId: id }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to disable hidden status');
            }
    
            const data = await response.json();
            toast.success(data.message);
            setIsHidden(!isHidden) // Update the hidden state to false
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <>
            <Grid item xs={12} sm={6} md={3} style={{ marginTop: '1rem' }}>
                <Card className='card'>
                    <CardMedia
                        component="img"
                        height="220"
                        src={image}
                        alt="Book Cover"
                        style={{ objectFit: 'contain', marginTop: 10 }}
                    />
                    <CardContent>
                        <Grid item>
                            <Typography variant="body1" component="div" textAlign='center'>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2" component="div" textAlign='center'>
                               Visible: {isHidden ? 'Yes' : 'No'}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={toggleModal} variant="contained" sx={{ background: 'linear-gradient(to right, #cb2d3e, #ef473a)', margin: 1 }} fullWidth >
                                <PreviewIcon sx={{marginRight: 1}} />
                                More Information
                            </Button>
                        </Grid>
                        <Grid item sx={{display: 'flex'}} >
                            <Button onClick={handleBookVisible} variant="contained" sx={{ background: 'linear-gradient(to right, #cb2d3e, #ef473a)', margin: 1, width: '40%' }} >
                                <CheckBoxIcon sx={{marginRight: 1}} />
                                Enable
                            </Button>
                            <Button onClick={handleBookNotVisible} variant="contained" sx={{ background: 'linear-gradient(to bottom, #ef473a, #cb2d3e)', margin: 1}} >
                                <IndeterminateCheckBoxIcon sx={{marginRight: 1}} />
                                Disable
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {isModalOpen && (
                <BookModal
                    book={{ title, author, description, publicationLocation, image, isbn, viewPath, downloadPath }}
                    onClose={toggleModal}
                />
            )}
        </>
    );
};

export default Book;