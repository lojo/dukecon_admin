define(['talks', 'auth'], function(talks, auth) {
	return {
		methodsForTalks: talks,
		methodsForAuth: {
			login: auth.login,
			logout: auth.logout
		}
	}
});