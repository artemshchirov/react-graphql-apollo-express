import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from './query/user';
import { GET_ONE_USER } from './query/user';
import { CREATE_USER } from './mutations/user';

import './App.css';

interface Users {
  id: number;
  username: string;
  age: number;
}

const App = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    pollInterval: 500,
  });
  const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 1,
    },
  });
  const [newUser] = useMutation(CREATE_USER);

  const [users, setUsers] = useState<Users[]>([]);
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(0);

  console.log(oneUser);

  useEffect(() => {
    if (!loading) setUsers(data.getAllUsers);
  }, [data]);

  const addUser = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    const createdUser = await newUser({
      variables: {
        input: {
          username,
          age,
        },
      },
    });
    console.log(createdUser);
    setUsername('');
    setAge(0);
  };

  const getAll = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    refetch();
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <form>
        <label htmlFor="name">Name</label>
        <input
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
          id="name"
          type="text"
        />
        <label htmlFor="age">Age</label>
        <input
          value={age}
          onChange={(evt) => setAge(Number(evt.target.value))}
          id="age"
          type="number"
        />
        <div className="btns">
          <button onClick={(evt) => addUser(evt)}>Create</button>
          <button onClick={(evt) => getAll(evt)}>Receive</button>
        </div>
      </form>
      <div>
        {users.map((user) => (
          <div className="user" key={user.id}>
            {user.id}. {user.username} {user.age}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
