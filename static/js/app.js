;(function () {
    'use strict'

    // addEventsListener
    function addEventsListener(object, types, callback) {
        types.split(' ').forEach(type => object.addEventListener(type, callback))
    }

    // Vars.
    var $body = document.querySelector('body')

    window.addEventListener('load', function () {

 //----
 
		var options = {
		  languageDictionary: {
			error: {
			  login: {
				'lock.unauthorized': 'Lejárt a próbaidőszak! Lépj kapcsolatba a /pokemonbudapest facebook csoporttal, hogy továbbra is használni tudd a térképet!'
			  }
			}
		  },
		  language: 'hu',
		  auth: {
				params: {scope: 'openid roles app_metadata'},
		  }
		};  
		
		var lock = new Auth0Lock('7IGpKBmL9sMljdFRUx2TNsNveNMFzbyX', 'pokemonbudapestvip.auth0.com',options);
		// localStorage.removeItem('a_good_joke');
		
		  // buttons
		  var btn_login = document.getElementById('btn-login');
		  var btn_logout = document.getElementById('btn-logout');

		  btn_login.addEventListener('click', function() {
			lock.show();
		  });

		  btn_logout.addEventListener('click', function() {
			 logout();
		  });

		  lock.on("authenticated", function(authResult) {
			console.log('authenticated')
			lock.getProfile(authResult.idToken, function(error, profile) {
			  if (error) {
				logout();
				return;
			  }

			  // Display user information
				show_profile_info(profile,authResult);
				//window.location.href = "/";
			});
		  });
		  lock.on('authorization_error', function(error) {
				console.log('remove token')
				localStorage.removeItem('a_good_joke');
			});


		  var retrieve_profile = function() {
			var id_token = localStorage.getItem('a_good_joke');
			console.log('retrieve profile')
			if (id_token) {
				console.log('van token')
			  lock.getProfile(id_token, function (err, profile) {
				if (err) {
				  logout();
				  return alert('There was an error getting the profile: ' + err.message);
				}
				
				show_profile_info(profile);
				});
			}
		  };

		  var show_profile_info = function(profile,authResult) {
			var expiration = new Date(profile.app_metadata.expiration);
			var year = expiration.getFullYear();
			var month = expiration.getMonth()+1;
			var day = expiration.getDate();
			var hours = '0' + expiration.getHours();
			var minutes = '0' + expiration.getMinutes();
			
			if (profile.roles.indexOf('expired') != -1) {
				if (profile.roles.indexOf('trial') != -1) {
					document.getElementById('info-msg').innerHTML = 'Lejárt a próbaidőszak!'
				} else {
					document.getElementById('info-msg').innerHTML = 'Lejárt az előfizetés ' + year + '.' + month + '.' + day + ' - ' + hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2) + '-kor'
					}
					if (profile.roles.indexOf('trial') != -1) {
					toastr['error']('Keresd a /pokemonbudapest facebook csoportot a további térképhasználatért!', 'Lejárt a próbaidőszak')
					} else {
					toastr['error']('Köszönjük az előfizetést! Reméljük sokat segített a térkép a ritka pokémonok megatalálásában! :D', 'Lejárt az előfizetés')
					}
					toastr.options = {
						'closeButton': true,
						'debug': false,
						'newestOnTop': true,
						'progressBar': false,
						'positionClass': 'toast-top-right',
						'preventDuplicates': true,
						'onclick': null,
						'showDuration': '10000',
						'hideDuration': '10000',
						'timeOut': '250000',
						'extendedTimeOut': '100000',
						'showEasing': 'swing',
						'hideEasing': 'linear',
						'showMethod': 'fadeIn',
						'hideMethod': 'fadeOut'
					}
				}
			if (profile.roles.indexOf('paid') != -1) {
				console.log('save token')
				localStorage.setItem('a_good_joke', authResult.idToken);
				if (profile.roles.indexOf('trial') != -1) {
					document.getElementById('info-msg').innerHTML = 'Próbaidőszak lejárta'
					document.getElementById('info-msg2').innerHTML = year + '.' + month + '.' + day + ' ' + hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2)
					
					} else {
					document.getElementById('info-msg').innerHTML = 'Előfizetés lejárta'
					document.getElementById('info-msg2').innerHTML = year + '.' + month + '.' + day + ' ' + hours.substr(hours.length-2) + ':' + minutes.substr(minutes.length-2) 
					}
				
				var avatar = document.getElementById('avatar');
				btn_login.style.display = "none";
				btn_logout.style.display = "inline";
				}
			// document.getElementById('nickname').textContent = profile.nickname;
		 //   avatar.src = profile.picture;
		 //   avatar.style.display = "none";
		  };


		  var logout = function() {
			console.log('remove token')
			localStorage.removeItem('a_good_joke');
			btn_login.style.display = "inline";
			btn_logout.style.display = "none";
			document.getElementById('info-msg').innerHTML = '';
			window.location.href = "/";
		  };


		  retrieve_profile();

 //-----

    });

    // Nav.
    var $nav = document.querySelector('#nav')
    var $navToggle = document.querySelector('a[href="#nav"]')
    var $navClose

    // Stats.
    var $stats = document.querySelector('#stats')
    var $statsToggle = document.querySelector('a[href="#stats"]')
    var $statsClose

    // Gym sidebar
    var $gymSidebar = document.querySelector('#gym-details')
    var $gymSidebarClose

    // Event: Prevent clicks/taps inside the nav from bubbling.
    addEventsListener($nav, 'click touchend', function (event) {
        event.stopPropagation()
    })

    if ($stats) {
        // Event: Prevent clicks/taps inside the stats from bubbling.
        addEventsListener($stats, 'click touchend', function (event) {
            event.stopPropagation()
        })
    }

    if ($gymSidebar) {
        // Event: Prevent clicks/taps inside the gym sidebar from bubbling.
        addEventsListener($gymSidebar, 'click touchend', function (event) {
            event.stopPropagation()
        })
    }

    // Event: Hide nav on body click/tap.
    addEventsListener($body, 'click touchend', function (event) {
        // on ios safari, when navToggle is clicked,
        // this function executes too, so if the target
        // is the toggle button, exit this function
        if (event.target.matches('a[href="#nav"]')) {
            return
        }
        if ($stats && event.target.matches('a[href="#stats"]')) {
            return
        }
        $nav.classList.remove('visible')
        if ($stats) {
            $stats.classList.remove('visible')
        }
    })
    // Toggle.

    // Event: Toggle nav on click.
    $navToggle.addEventListener('click', function (event) {
        event.preventDefault()
        event.stopPropagation()
        $nav.classList.toggle('visible')
    })

    // Event: Toggle stats on click.
    if ($statsToggle) {
        $statsToggle.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            $stats.classList.toggle('visible')
        })
    }

    // Close.

    // Create elements.
    $navClose = document.createElement('a')
    $navClose.href = '#'
    $navClose.className = 'close'
    $navClose.tabIndex = 0
    $nav.appendChild($navClose)

    if ($stats) {
        $statsClose = document.createElement('a')
        $statsClose.href = '#'
        $statsClose.className = 'close'
        $statsClose.tabIndex = 0
        $stats.appendChild($statsClose)
    }

    $gymSidebarClose = document.createElement('a')
    $gymSidebarClose.href = '#'
    $gymSidebarClose.className = 'close'
    $gymSidebarClose.tabIndex = 0
    $gymSidebar.appendChild($gymSidebarClose)

    // Event: Hide on ESC.
    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27) {
            $nav.classList.remove('visible')
            if ($stats) {
                $stats.classList.remove('visible')
            }
            if ($gymSidebar) {
                $gymSidebar.classList.remove('visible')
            }
        }
    })

    // Event: Hide nav on click.
    $navClose.addEventListener('click', function (event) {
        event.preventDefault()
        event.stopPropagation()
        $nav.classList.remove('visible')
    })

    if ($statsClose) {
        // Event: Hide stats on click.
        $statsClose.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            $stats.classList.remove('visible')
        })
    }

    if ($gymSidebarClose) {
        // Event: Hide stats on click.
        $gymSidebarClose.addEventListener('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            $gymSidebar.classList.remove('visible')
        })
    }
})()
