// 查询用户地址, userId是Phone Number
function insertUserAddress(conn, userId, addr) {
	console.log("-------insertUserAddress---------", userId)
	return new Promise((resolve, reject) => {
		conn.then(con => {
			con.query("SELECT * FROM house_addr_map_user WHERE userid = ? ", [userId],  function (err, result, fields) {
			    if (err) console.log(err);
			    console.log(result)
			    if (result != null && result.length != 0) {
			    	resolve({status:201, data: result[0].addr});
			    } else {
			    	// 插入map表
					let insertSql = "INSERT INTO house_addr_map_user (`userid`, `addr`, `status`, `createtime`, `updatetime`) VALUES ?";
					let addParam = [[userId, addr, 0, Date.now(), Date.now()]]; // Mul
					con.query(insertSql, [addParam], function(err, result, fileds){
						console.log("--insert map--user address-----",result);
						if (err) {
							console.log(err);
							resolve({status:202, data:"该用户已经生成过地址！"});
						} else {
							let sql = "INSERT INTO user_approve_record (`approver_addr`, `userid`, `state`, `createtime`, `updatetime`) VALUES ?";
				            let param = [[addr, userId, 0, Date.now(), Date.now()]]; // Mul
				            con.query(sql, [param], function(err, res, fileds){
				                  console.log("--insert map--user address-----",res);
					              if (err) {
					                console.log(err);
					              } else {
					                resolve({status:200, data:res});
					              }
				            })
							resolve({status:200, data:result});
						}
					})
			    }
		    });
		}).catch(err => {
			console.log("---insert userid map address error----", err);
			reject(err);
		});
	});
}
// 查询用户地址, userId是Phone Number
function queryUserAddress(conn, userId) {
	console.log("-------queryUserAddress---------", userId)
	return new Promise((resolve, reject) => {
		conn.then(con => {
			con.query("SELECT * FROM house_addr_map_user WHERE userid = ? ", [userId],  function (err, result, fields) {
			    if (err) console.log(err);
			    if (result != null && result.length != 0) {
			    	resolve({status:true, data:result[0].addr});
			    } else {
			    	resolve({status: false, data: result});
			    }
		    });
			// con.release();
		}).catch(err => {
			console.log("----query---error---" ,err)
			reject(err);
		});
	});
}

// 根据地址查询用户状态
function queryUserStatus(conn, addr) {
	console.log("-------queryUserStatus---------", addr)
	return new Promise((resolve, reject) => {
		conn.then(con => { 
			con.query("SELECT * FROM house_addr_map_user WHERE addr = ?", [addr],  function (err, result, fields) {
			    if (err) {
			    	console.log(err);
			    	resolve({status: false, err:"该地址未绑定手机号，未查询到登录状态！"})
			    }
			    if (result != null && result.length == 1) {
			    	resolve({status:true, data:result[0].status});
			    } else {
			    	resolve({status: false, data: result});
			    }
		    });
		}).catch(err => {
			console.log("----query---error---" ,err)
			reject(err);
		});
	});
}

function updateUserStatus(conn, userId, addr, state) {
	console.log("-------update Release Info---------", userId, addr)
	return new Promise((resolve, reject) => {
		conn.then(con => {
			con.query("UPDATE `house_addr_map_user` SET `status` = ?, `updatetime` = ? WHERE `addr` = ?", [state, Date.now(), addr], function(err, result, fileds){
				console.log("---update ---", result);
			});
			con.query("SELECT * FROM house_addr_map_user WHERE addr = ? ", [addr],  function (err, result, fields) {
			    if (err) {
			    	console.log("Query release after update info" ,err);
			    	reject(err);
			    }
			    if (result != null && result.length != 0) {
			    	resolve({status:true, data:result[0].addr});
			    } else {
			    	resolve({status: false, err: result});
			    }
		    });
		}).catch(err => {
			console.log("----query-release--error---" ,err)
			reject(err);
		});
	});
}

function getUserInfo(conn, addr, userId) {
	console.log("-------get User Info-------", userId)
	return new Promise((resolve, reject) => {
		conn.then(con => {
			let sql, criteria;
			if (!addr || addr == '0x') {
				if (!userId || userId == '1') {
					sql = "SELECT * FROM user_approve_record";
					criteria = [];
				} else {
					sql = "SELECT * FROM user_approve_record WHERE `userid` = ?";
					criteria = [userId];
				}
			} else {
				if (!userId || userId == '1') {
					sql = "SELECT * FROM user_approve_record WHERE `approver_addr`= ?";
					criteria = [addr];
				} else {
					sql = "SELECT * FROM user_approve_record WHERE `userid` = ? AND `approver_addr`= ?";
					criteria = [userId, addr];
				}
			}
			con.query(sql, criteria,  function (err, result, fields) {
			    if (err) {
			    	console.log(err)
			    	resolve(err);
			    }
			    console.log("--get the result--",result)
			    if (result != null && result.length != 0) {
			    	resolve({status:true, data:result});
			    } else {
			    	resolve({status: false, data: result});
			    }
		    });
		}).catch(err => {
			console.log("----query-user--error---" ,err)
			reject(err);
		});
	});
}
function insertApprove(conn, addr, reqAddr) {
	return new Promise((resolve, reject) => {
		conn.then(con => {
			let sql = "UPDATE `user_approve_record` SET `visit_addr` = ?,`state` = ?,`updatetime` = ? WHERE `addr` = ?";
			con.query(sql, [reqAddr, 2, Date.now(), addr], function (err, result, fields) {
			    if (err) {
			    	console.log(err)
			    	resolve(err);
			    }
			    console.log("--get the result--",result)
			    if (result != null && result.length != 0) {
			    	resolve({status:true, data:result});
			    } else {
			    	resolve({status: false, data: result});
			    }
		    });
		}).catch(err => {
			console.log("----update--error---" ,err)
			reject(err);
		});
	});
}
function updateApprove(conn, addr, reqAddr) {
	return new Promise((resolve, reject) => {
		conn.then(con => {
			let sql = "UPDATE `user_approve_record` SET `state` = ?,`updatetime` = ? WHERE `addr` = ? AND `visit_addr`=?";
			// approving
			con.query(sql, [3, Date.now(), addr,reqAddr], function (err, result, fields) {
			    if (err) { 
			    	console.log(err)
			    	resolve(err);
			    }
			    console.log("--get the result--",result)
			    if (result != null && result.length != 0) {
			    	resolve({status:true, data:result});
			    } else {
			    	resolve({status: false, data: result});
			    }
		    });
		}).catch(err => {
			console.log("----update--error---" ,err)
			reject(err);
		});
	});
}

module.exports = {
	queryUserAddress,
	insertUserAddress,
	updateUserStatus,
	queryUserStatus,
	getUserInfo,
	insertApprove,
	updateApprove
}