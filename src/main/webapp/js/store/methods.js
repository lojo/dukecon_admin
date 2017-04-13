define(['computed', 'talks', 'auth'], function(computed, talks, auth) {
	return {
		computed: computed,
		methodsForTalks: talks,
		methodsForAuth: {
			login: auth.login,
			logout: auth.logout
		}
	}
});