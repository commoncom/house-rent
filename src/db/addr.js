// 查询用户地址, userId是Phone Number
function queryUserAddress(conn, userId) {
	console.log("-------queryUserAddress---------", userId)
	return new Promise((resolve, reject) => {
		conn.then(con => {
			con.query("SELECT * FROM address_map_user WHERE userid = ? ", [userId],  function (err, result, fields) {
			    if (err) console.log(err);
			    if (result != null && result.length != 0) {
			    	resolve(result[0].address);
			    } else {
			    	resolve(result);
			    }
			  });
			con.release();
		}).catch(err => {
			console.log("----queryUserAddress----error---" ,err)
			reject(err);
		});
	});
}


module.exports = {
	queryUserAddress
}