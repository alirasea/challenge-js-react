import"./Gituser.css"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Gituser() {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [repo, setRepo] = useState([]);
    const [error, setError] = useState('');

    const defaultUsername = 'alirasea';

    const fetchData = async (username) => {
        try {
            const { data: userData } = await axios.get(`https://api.github.com/users/alirasea?client_id=0b32ba8b7dec25cdd36b&client_secret=6a36e45a193bee28b6d5bd3f2bc7ba87122177e1&sort=created=${username}`);
            setUserData(userData);
            const { data: repoData } = await axios.get(userData.repos_url);
            setRepo(repoData);
        } catch (error) {
            setError('Error fetching user data');
        }
    };

    useEffect(() => {
        if (username) {
            fetchData(username);
        }
    }, [username]);

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); fetchData(username); }}>
                <input
                    type="text"
                    value={username}
                    onChange={handleInputChange}
                    placeholder="Enter GitHub username"
                    required
                />
            </form>
            {userData && (
                <div>
                    <div className="container">
                        <div>
                            <img src={userData.avatar_url} alt="User Avatar" />
                        </div>
                        <div className='userInfo'>
                            <h3>FullName: {userData.name}</h3>
                            <h3>Username: {userData.login}</h3>
                            <h3>Location: {userData.location}</h3>
                            <h3>Email Address: {userData.email || 'no email'}</h3>
                        </div>
                    </div>
                    <h3>User repositories</h3>
                    {repo.map(repos => (
                        <div key={repos.id} className='repoInfo'>
                            <h3>
                                <a href={repos.html_url} target="_blank" rel="noopener noreferrer">{repos.name}</a>
                            </h3>
                        </div>
                    ))}
                </div>
            )}
            {username === defaultUsername && (
                <div>
                    <p>You entered the default username.</p>
                    {/* Render additional content here for the default username */}
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
}
