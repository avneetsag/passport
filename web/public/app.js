$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'https://api-taupe.vercel.app/api';
const MQTT = 'http://localhost:5001/send-command';

const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];



$.get('/auth/google/user', (res)=>{
  console.log("get runs");
  const logGoogle = localStorage.getItem('logGoogle');
  console.log("Log google is apparently "+logGoogle);
  if (logGoogle){
      console.log("This is true");
      localStorage.setItem('user',res.name);
      localStorage.setItem('isAdmin',res.isAdmin);
      localStorage.setItem('isAuthenticated',true);
  }else{
      console.log("this is false");
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isAuthenticated');
  }
});


if (localStorage.getItem('logGoogle')) {
  const currentUser = localStorage.getItem('user');
  $.get(`${API_URL}/users/${currentUser}/devices`)
  .then(response => {
      response.forEach((device)=> {
          $('#devices tbody').append(`
              <tr data-device-id=${device._id}>
                  <td>${device.user}</td>
                  <td>${device.name}</td>
              </tr>`
          );
      });
      $('#devices tbody tr').on('click', (e) => {
          const deviceId = e.currentTarget.getAttribute('data-device-id');
          $.get(`${API_URL}/devices/${deviceId}/device-history`)
          .then(response => {
              response.map(sensorData => {
                  $('#historyContent').removeClass().text("");
                  $('#historyContent').append(`
                  <tr>
                      <td>${sensorData.ts}</td>
                      <td>${sensorData.temp}</td>
                      <td>${sensorData.loc.lat}</td>
                      <td>${sensorData.loc.lon}</td>
                  </tr>
                  `);
              });
              $('#historyModal').modal('show');
          });
      });
  })
  .catch(error => {
      console.error(`Error: ${error}`);
  });
}else {
  const path = window.location.pathname;
  if(path !== '/login') {
      location.href = '/login';
  }
}

//const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const users = JSON.parse(localStorage.getItem('users')) || [];
$('#add-device').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];
  const body = {
    name,
    user,
    sensorData
  };

  $.post(`${API_URL}/devices`, body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})

$('#send-command').on('click', function () {
  const command = $('#command').val();
  const deviceId = $('#deviceId').val();

  $.post(`${MQTT}`, { command, deviceId })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});
$('#register').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();
  if (password !== confirm) {
    $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
  } else {
    $.post(`${API_URL}/registration`, { user, password })
      .then((response) => {
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
  }
});
$('#login').on('click', (req,res)=> {
  localStorage.setItem('logGoogle',true);
  location.href ='/auth/google';
});
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  location.href = '/login';
}
