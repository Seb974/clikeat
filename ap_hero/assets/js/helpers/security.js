function tokenConfig() {

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }  
    return config;
}

export { tokenConfig };