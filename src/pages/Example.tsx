import axios from 'axios';
import { useEffect } from 'react';

const Example = () => {
  useEffect(() => {
    const a = async () => {
      try {
        const user = await axios.post('http://localhost:5000/users/signin', {
          userId: 'dd',
          userPassword: 'sdfsdf',
        });
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };
    a();
  });
  return <div>dfsdf</div>;
};

export default Example;
