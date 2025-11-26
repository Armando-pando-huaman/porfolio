import React, { useState, useEffect } from 'react';

const Header = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Error fetching profile');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!profile) return <div>Error cargando perfil</div>;

  return (
    <header>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.email}</p>
      <p>{profile.location}</p>
    </header>
  );
};

export default Header;