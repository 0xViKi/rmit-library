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
import FileOpenIcon from '@mui/icons-material/FileOpen'; 
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import BookModal from '../BookModal/BookModal'
import './book.css'

const Book = ({ title, author, isbn, description, publicationLocation, image, viewPath, downloadPath, visible }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    if (!visible) {
        return null;
    }

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
                            <Button onClick={toggleModal} variant="contained" sx={{ background: 'linear-gradient(to right, #cb2d3e, #ef473a)', margin: 1 }} fullWidth >
                                <PreviewIcon sx={{marginRight: 1}} />
                                More Information
                            </Button>
                        </Grid>
                        <Grid item sx={{display: 'flex'}} >
                            <Button href={viewPath} target='_blank' variant="contained" sx={{ background: 'linear-gradient(to right, #cb2d3e, #ef473a)', margin: 1, width: '40%' }} >
                                <FileOpenIcon sx={{marginRight: 1}} />
                                View
                            </Button>
                            <Button download href={downloadPath} variant="contained" sx={{ background: 'linear-gradient(to bottom, #ef473a, #cb2d3e)', margin: 1}} >
                                <DownloadForOfflineIcon sx={{marginRight: 1}} />
                                Download
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {isModalOpen && (
                <BookModal
                    book={{ title, author, description, publicationLocation, image, isbn }}
                    onClose={toggleModal}
                />
            )}
        </>
    );
};

export default Book;