// Initialize localStorage if not already set
if (!localStorage.getItem('validToken')) {
  localStorage.setItem('validToken', 'token1');
}

if (!localStorage.getItem('registeredTokens')) {
  localStorage.setItem('registeredTokens', JSON.stringify({}));
}

// Check if the device has already registered a token
var deviceID = localStorage.getItem('deviceID');
var registeredTokens = JSON.parse(localStorage.getItem('registeredTokens'));
var tokenRegisteredForDevice = registeredTokens[deviceID];

// Show the popup if the device has not registered a token
if (!tokenRegisteredForDevice) {
  window.onload = function() {
    console.log('Popup displayed');
    document.getElementById('popup').style.display = 'block';
  };
}

document.getElementById('tokenForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  
  // Get the entered token
  var token = document.getElementById('token').value;
  
  // Check if the entered token is valid and matches the registered token for the device
  var validToken = localStorage.getItem('validToken');
  
  if (token === validToken && !tokenRegisteredForDevice) {
    // Register the token to the current device
    registeredTokens[deviceID] = true;
    localStorage.setItem('registeredTokens', JSON.stringify(registeredTokens));
    
    // Hide the popup
    console.log('Token registered');
    document.getElementById('popup').style.display = 'none';
  } else {
    // Show access denied message
    console.log('Invalid token or token already used');
    showAccessDeniedMessage('Invalid token or token already used');
  }
});

// Function to show access denied message
function showAccessDeniedMessage(message) {
  // Show access denied message
  console.log('Access denied: ' + message);
  var accessDeniedMsg = document.getElementById('accessDenied');
  accessDeniedMsg.classList.remove('hidden');
  accessDeniedMsg.textContent = message;
}
// Check if the device has already registered a token
var deviceID = localStorage.getItem('deviceID');
var registeredTokens = JSON.parse(localStorage.getItem('registeredTokens'));
var tokenRegisteredForDevice = registeredTokens[deviceID];

if (tokenRegisteredForDevice) {
  console.log('Device is registered');
} else {
  console.log('Device is not registered');
}

function filterArticles() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById('articleList');
  li = ul.getElementsByTagName('li');
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName('a')[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}

// Scroll to the clicked article on the right side
document.querySelector('.menu-btn').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('active');
});

document.querySelectorAll('#articleList a').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    var targetId = item.getAttribute('href').substring(1);
    var targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
