module.exports = 
{
	'secret' : 'longobnoxiouspassphrase',
	'dbPath' : '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME,
	'port' : process.env.OPENSHIFT_NODEJS_PORT || 9000,
	'server_ip_address' : process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
};
