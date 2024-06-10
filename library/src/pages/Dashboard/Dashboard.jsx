import React, { useState, useEffect,  } from 'react';
import { AppBar, Toolbar, Typography, TextField, Box, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import BookList from '../../components/BookList/BookList';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';

const Dashboard = () => {
    const { username } = useParams()
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()
    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
      };

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleShowAllBooks = async () => {
        setQuery('')
        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent('')}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            setFilteredBooks(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
        
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setBooks(data);
                setFilteredBooks(data);
            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleSearch = async () => {
        if (!query.trim()) {
            setFilteredBooks(books);
            return;
        }

        try {
            const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            console.log(data)
            if (data.length === 0 || !data.visible){
                toast("No Book found by that Name or Author!!!")
            }
            setFilteredBooks(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleLogout = async () => {
      try {
          const response = await fetch('/api/logout', {
              method: 'POST',
              credentials: 'include'
          });
          if (!response.ok) {
              throw new Error('Failed to logout');
          }
          navigate('/') 
      } catch (error) {
          console.error('Error logging out:', error);
      }
  };

    return (
        <>
            <AppBar position="relative" sx={{ background: 'linear-gradient(to right, #eb3349, #f45c43)' }}>
                <Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={3} md={3} sx={{ alignItems: 'center', display: 'flex' }}>
                            <div onClick={handleShowAllBooks}>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1/2 }}>
                                RMIT Library
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TextField
                                    label="Search book by Name, Author"
                                    value={query}
                                    onChange={handleInputChange}
                                    fullWidth
                                    size="small"
                                    variant="filled"
                                    sx={{ mr: 2, input: { color: 'white' } }}
                                    InputLabelProps={{
                                        style: { color: '#fff' },
                                    }}
                                />
                                <IconButton onClick={handleSearch}>
                                    <SearchSharpIcon sx={{ color: 'white' }} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item md={3} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'row-reverse' }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar sx={{ background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' }} > {username[0].toUpperCase()+username[1].toUpperCase()} </Avatar>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem > {username} </MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Grid>
                       
                    </Grid>
                </Toolbar>
            </AppBar>
            <BookList books={filteredBooks} />
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition= {Slide}
                />
        </>
    );
};

export default Dashboard;
