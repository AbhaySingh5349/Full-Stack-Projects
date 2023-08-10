console.log('hellu');

const login = async (email, password) => {
  console.log('email: ', email, ' , password: ', password);
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:3000/auth/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
    });

    console.log('login result: ', result);
  } catch (err) {
    console.log('error in login: ', err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault(); // preventing from loading any other page

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // console.log('hellu');
  login(email, password);
});
