import React, { useState, useEffect } from 'react';

const Home = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <section id="home">
      <img src={`/api/file/${profile.image}`} alt={profile.name} />
      <h1>{profile.name}</h1>
      <h2>{profile.title}</h2>
      <p>{profile.location}</p>
      <p>{profile.phone}</p>
      <p>{profile.email}</p>
      <a href={profile.linkedin}>LinkedIn</a>
      <p>{profile.description}</p>
    </section>
  );
};

export default Home;