import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link, NavLink} from "react-router-dom";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token');
    
    useEffect(() => {

        if (token)
            fetchUserProfile(token);
        else
            setUsername('');

        const handleStorageChange = () => {
            if (localStorage.getItem('token')) {
                fetchUserProfile(localStorage.getItem('token'));
            } else {
                setUsername('');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/users/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            } else {
                console.log('Profile fetch failed');
            }
        }
        catch (error) {
            console.error('Profile fetch failed:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUsername('');
        window.dispatchEvent(new Event('storage'));
        navigate('/'); 
    };
 
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/" style={{ "color": 'gold' }}>
                    <FontAwesomeIcon icon={faVideoSlash} /> Lol
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/watchList">Watchlist</NavLink>
                    </Nav>
                    {username ? (
                        <>
                            <span className="font-weight-bold navbar-text text-info me-3">Welcome, {username}!</span>
                            <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/Login" className="btn btn-outline-info me-2">Login</Link>
                            <Link to="/Register" className="btn btn-outline-info">Register</Link>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header