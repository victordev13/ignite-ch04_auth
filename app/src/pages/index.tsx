import type { NextPage } from 'next';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) =>
              setEmail(e.target.value)
            }></input>
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) =>
              setPassword(e.target.value)
            }></input>
        </div>
        <div className={styles.field}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Home;
